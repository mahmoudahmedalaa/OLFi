import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const EMPLOYMENT_TYPES = [
    { key: 'salaried', label: 'Salaried', icon: 'briefcase' as const },
    { key: 'self_employed', label: 'Self-employed', icon: 'construct' as const },
    { key: 'business_owner', label: 'Business Owner', icon: 'storefront' as const },
    { key: 'freelancer', label: 'Freelancer', icon: 'laptop' as const },
    { key: 'retired', label: 'Retired', icon: 'cafe' as const },
];

const RESIDENCY_TYPES = [
    { key: 'resident', label: 'UAE Resident', icon: 'home-outline' as const },
    { key: 'citizen', label: 'UAE Citizen', icon: 'flag-outline' as const },
    { key: 'non_resident', label: 'Non-Resident', icon: 'airplane-outline' as const },
];

export default function EditProfileScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [employmentType, setEmploymentType] = useState('salaried');
    const [nationality, setNationality] = useState('');
    const [residencyStatus, setResidencyStatus] = useState('resident');

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, salary, employment_type, nationality, residency_status')
                .eq('id', user.id)
                .maybeSingle();
            if (error) throw error;
            if (data) {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setMonthlyIncome(data.salary ? String(data.salary) : '');
                setEmploymentType(data.employment_type || 'salaried');
                setNationality(data.nationality || '');
                setResidencyStatus(data.residency_status || 'resident');
            }
        } catch (e) {
            console.error('Error fetching profile:', e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleSave = async () => {
        if (!firstName.trim()) {
            Alert.alert('Required', 'First name is required.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
                    salary: monthlyIncome ? parseFloat(monthlyIncome) : null,
                    employment_type: employmentType,
                    nationality: nationality.trim() || null,
                    residency_status: residencyStatus,
                    updated_at: new Date().toISOString(),
                });
            if (error) throw error;
            Alert.alert('Saved', 'Profile updated successfully.');
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.brand.emerald} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.brand.teal, fontStyle: 'italic', marginTop: 12, letterSpacing: 0.3 }}>your debt, rewritten</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                        Edit Profile
                    </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                    {/* Verification Progress */}
                    {(() => {
                        const fields = [
                            { done: !!firstName.trim(), label: 'Name' },
                            { done: !!monthlyIncome, label: 'Income' },
                            { done: !!nationality.trim(), label: 'Nationality' },
                            { done: !!employmentType, label: 'Employment' },
                            { done: !!residencyStatus, label: 'Residency' },
                        ];
                        const completed = fields.filter(f => f.done).length;
                        const pct = Math.round((completed / fields.length) * 100);
                        return (
                            <View style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 16,
                                marginBottom: 24,
                                borderWidth: 1,
                                borderColor: pct === 100 ? Colors.brand.emerald + '40' : theme.colors.border,
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary }}>Profile Completion</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: pct === 100 ? Colors.brand.emerald : Colors.brand.teal }}>{pct}%</Text>
                                </View>
                                <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.colors.border }}>
                                    <View style={{
                                        height: 6,
                                        borderRadius: 3,
                                        width: `${pct}%`,
                                        backgroundColor: pct === 100 ? Colors.brand.emerald : Colors.brand.teal,
                                    }} />
                                </View>
                                {pct < 100 && (
                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 8 }}>
                                        Complete your profile for faster loan approvals
                                    </Text>
                                )}
                            </View>
                        );
                    })()}

                    {/* Name fields */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <InputField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="John" theme={theme} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" theme={theme} />
                        </View>
                    </View>

                    {/* Email (read-only) */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6 }}>Email</Text>
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            paddingHorizontal: 14,
                            paddingVertical: 14,
                            opacity: 0.6,
                        }}>
                            <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>{user?.email}</Text>
                        </View>
                    </View>

                    <InputField label="Monthly Income (AED)" value={monthlyIncome} onChangeText={setMonthlyIncome} placeholder="25000" theme={theme} keyboardType="numeric" />
                    <InputField label="Nationality" value={nationality} onChangeText={setNationality} placeholder="e.g. UAE, India, Egypt" theme={theme} />

                    {/* Employment Type */}
                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 10 }}>Employment Type</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                        {EMPLOYMENT_TYPES.map(type => {
                            const sel = employmentType === type.key;
                            return (
                                <TouchableOpacity
                                    key={type.key}
                                    onPress={() => setEmploymentType(type.key)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        backgroundColor: sel ? Colors.brand.emerald : theme.colors.card,
                                        borderWidth: sel ? 0 : 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Ionicons name={type.icon} size={16} color={sel ? '#fff' : theme.colors.textSecondary} />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: sel ? '#fff' : theme.colors.textSecondary }}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Residency Status */}
                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 10 }}>Residency Status</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                        {RESIDENCY_TYPES.map(type => {
                            const sel = residencyStatus === type.key;
                            return (
                                <TouchableOpacity
                                    key={type.key}
                                    onPress={() => setResidencyStatus(type.key)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        backgroundColor: sel ? Colors.brand.teal : theme.colors.card,
                                        borderWidth: sel ? 0 : 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Ionicons name={type.icon} size={16} color={sel ? '#fff' : theme.colors.textSecondary} />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: sel ? '#fff' : theme.colors.textSecondary }}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Save CTA */}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 20,
                    paddingBottom: 34,
                    paddingTop: 12,
                    backgroundColor: theme.colors.bg,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                }}>
                    <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                borderRadius: BorderRadius.md,
                                height: 56,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Save Profile</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    theme,
    keyboardType = 'default',
}: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    theme: any;
    keyboardType?: 'default' | 'numeric';
}) {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6 }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textDisabled}
                keyboardType={keyboardType}
                style={{
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: theme.colors.textPrimary,
                }}
            />
        </View>
    );
}
