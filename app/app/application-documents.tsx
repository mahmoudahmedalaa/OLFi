import React, { useCallback, useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const DOCUMENT_BUCKET = 'user-documents';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
type IoniconName = ComponentProps<typeof Ionicons>['name'];
type DocumentTypeOption = {
    value: 'emirates_id' | 'salary_slip' | 'bank_statement' | 'other';
    label: string;
    description: string;
    icon: IoniconName;
};

const DOCUMENT_TYPES: DocumentTypeOption[] = [
    {
        value: 'emirates_id',
        label: 'Emirates ID',
        description: 'Front or back image, or a single PDF copy.',
        icon: 'id-card-outline',
    },
    {
        value: 'salary_slip',
        label: 'Salary Certificate',
        description: 'Latest salary certificate or payslip.',
        icon: 'briefcase-outline',
    },
    {
        value: 'bank_statement',
        label: 'Bank Statement',
        description: 'Latest three to six months as PDF.',
        icon: 'document-text-outline',
    },
    {
        value: 'other',
        label: 'Other Document',
        description: 'Any extra bank-requested support file.',
        icon: 'folder-outline',
    },
];

interface UploadedDocument {
    id: string;
    document_type: string;
    file_name: string | null;
    status: string;
    created_at: string;
    file_size: number | null;
}

function sanitizeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').slice(0, 80);
}

function base64ToArrayBuffer(base64: string) {
    const binaryString = globalThis.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDocumentType(type: string) {
    return type
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function ApplicationDocumentsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const params = useLocalSearchParams<{ applicationId?: string; bankName?: string }>();
    const applicationId = typeof params.applicationId === 'string' ? params.applicationId : '';
    const bankName = typeof params.bankName === 'string' ? params.bankName : 'the bank';
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingType, setUploadingType] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        if (!user || !applicationId) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('user_documents')
            .select('id, document_type, file_name, status, created_at, file_size')
            .eq('user_id', user.id)
            .eq('application_id', applicationId)
            .order('created_at', { ascending: false });

        if (!error) {
            setDocuments((data || []) as UploadedDocument[]);
        }
        setLoading(false);
    }, [applicationId, user]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const uploadDocument = async (documentType: string) => {
        if (!user || !applicationId) {
            Alert.alert('Sign in required', 'Please sign in again before uploading documents.');
            return;
        }

        try {
            setUploadingType(documentType);
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'],
                copyToCacheDirectory: true,
                multiple: false,
                base64: false,
            });

            if (result.canceled || !result.assets?.[0]) return;

            const asset = result.assets[0];
            if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
                Alert.alert('File too large', 'Please choose a PDF or image under 10 MB.');
                return;
            }

            const safeName = sanitizeFileName(asset.name || `${documentType}.pdf`);
            const storagePath = `${user.id}/${applicationId}/${Date.now()}-${safeName}`;
            const mimeType = asset.mimeType || 'application/octet-stream';
            const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const fileBody = base64ToArrayBuffer(base64);

            const { error: uploadError } = await supabase.storage
                .from(DOCUMENT_BUCKET)
                .upload(storagePath, fileBody, {
                    contentType: mimeType,
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            const { error: insertError } = await supabase
                .from('user_documents')
                .insert({
                    user_id: user.id,
                    application_id: applicationId,
                    document_type: documentType,
                    file_url: storagePath,
                    file_name: asset.name || safeName,
                    storage_bucket: DOCUMENT_BUCKET,
                    storage_path: storagePath,
                    mime_type: mimeType,
                    file_size: asset.size || null,
                    notes: `Uploaded for ${bankName} application`,
                    status: 'pending',
                });

            if (insertError) {
                await supabase.storage.from(DOCUMENT_BUCKET).remove([storagePath]);
                throw insertError;
            }

            await fetchDocuments();
            Alert.alert('Document uploaded', 'OLFi received the file and attached it to this application.');
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Please try again.';
            Alert.alert('Upload failed', message);
        } finally {
            setUploadingType(null);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary }}>
                        Documents
                    </Text>
                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                        Secure uploads for {bankName}
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}>
                <LinearGradient
                    colors={theme.gradients.cardElevated}
                    style={{
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        padding: 16,
                        marginBottom: 18,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View
                            style={{
                                width: 46,
                                height: 46,
                                borderRadius: 23,
                                backgroundColor: `${Colors.brand.emerald}18`,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="lock-closed" size={20} color={Colors.brand.emerald} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>
                                Bank review documents
                            </Text>
                            <Text style={{ fontSize: 13, lineHeight: 19, color: theme.colors.textSecondary, marginTop: 3 }}>
                                Upload only the files requested for this application. PDFs and images up to 10 MB are supported.
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                    Upload
                </Text>
                {DOCUMENT_TYPES.map((item) => {
                    const isUploading = uploadingType === item.value;
                    return (
                        <TouchableOpacity
                            key={item.value}
                            activeOpacity={0.85}
                            disabled={!!uploadingType}
                            onPress={() => uploadDocument(item.value)}
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                padding: 14,
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
                                opacity: uploadingType && !isUploading ? 0.55 : 1,
                            }}
                        >
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: `${Colors.brand.emerald}15`,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons name={item.icon} size={19} color={Colors.brand.emerald} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary }}>
                                    {item.label}
                                </Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }}>
                                    {item.description}
                                </Text>
                            </View>
                            {isUploading ? (
                                <ActivityIndicator color={Colors.brand.emerald} />
                            ) : (
                                <Ionicons name="cloud-upload-outline" size={21} color={theme.colors.textTertiary} />
                            )}
                        </TouchableOpacity>
                    );
                })}

                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 14, marginBottom: 10 }}>
                    Uploaded
                </Text>
                {loading ? (
                    <ActivityIndicator color={Colors.brand.emerald} style={{ marginTop: 16 }} />
                ) : documents.length === 0 ? (
                    <View
                        style={{
                            borderRadius: BorderRadius.lg,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            padding: 18,
                            alignItems: 'center',
                            backgroundColor: theme.colors.card,
                        }}
                    >
                        <Ionicons name="folder-open-outline" size={30} color={theme.colors.textTertiary} />
                        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 10 }}>
                            No documents uploaded yet
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textTertiary, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
                            Files you attach to this application will appear here.
                        </Text>
                    </View>
                ) : (
                    documents.map((document) => (
                        <View
                            key={document.id}
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.md,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                padding: 13,
                                marginBottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <Ionicons name="document-attach-outline" size={21} color={Colors.brand.emerald} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary }} numberOfLines={1}>
                                    {document.file_name || formatDocumentType(document.document_type)}
                                </Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }}>
                                    {formatDocumentType(document.document_type)} • {document.status} • {formatDate(document.created_at)}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
