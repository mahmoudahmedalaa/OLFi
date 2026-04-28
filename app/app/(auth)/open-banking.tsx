import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, Animated, Image, ScrollView,
    Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, BorderRadius } from '@/lib/constants';

// ─── Bank data ────────────────────────────────────────────────────────────────

const UAE_BANKS = [
    { id: 'FAB', name: 'First Abu Dhabi Bank', shortName: 'FAB', color: '#00A5D9', initials: 'FAB' },
    { id: 'ENBD', name: 'Emirates NBD', shortName: 'Emirates NBD', color: '#E3051B', initials: 'NBD' },
    { id: 'ADCB', name: 'Abu Dhabi Commercial Bank', shortName: 'ADCB', color: '#FF6A00', initials: 'ADCB' },
    { id: 'DIB', name: 'Dubai Islamic Bank', shortName: 'DIB', color: '#006C35', initials: 'DIB' },
    { id: 'MASHREQ', name: 'Mashreq Bank', shortName: 'Mashreq', color: '#E31837', initials: 'MSH' },
    { id: 'ADIB', name: 'Abu Dhabi Islamic Bank', shortName: 'ADIB', color: '#8B0000', initials: 'ADIB' },
    { id: 'CBD', name: 'Commercial Bank of Dubai', shortName: 'CBD', color: '#003087', initials: 'CBD' },
    { id: 'RAKBank', name: 'RAKBank', shortName: 'RAKBank', color: '#6D1E3A', initials: 'RAK' },
] as const;

type BankId = typeof UAE_BANKS[number]['id'];

// ─── Trust chips ──────────────────────────────────────────────────────────────

const TRUST_CHIPS = [
    { icon: 'eye-off-outline' as const, label: 'Read-only access' },
    { icon: 'shield-checkmark-outline' as const, label: '256-bit encrypted' },
    { icon: 'close-circle-outline' as const, label: 'Revoke anytime' },
];

// ─── Mock login modal ─────────────────────────────────────────────────────────

interface MockLoginModalProps {
    visible: boolean;
    bank: typeof UAE_BANKS[number] | undefined;
    onSuccess: () => void;
    onDismiss: () => void;
}

function MockLoginModal({ visible, bank, onSuccess, onDismiss }: MockLoginModalProps) {
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) {
            setUsername('');
            setPassword('');
            setLoading(false);
        }
    }, [visible]);

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                })
            ).start();
            const timer = setTimeout(() => {
                setLoading(false);
                onSuccess();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
            <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: 'flex-end' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={onDismiss} activeOpacity={1} />
                    <View style={[styles.modalSheet, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        {/* Handle bar */}
                        <View style={[styles.handleBar, { backgroundColor: theme.colors.border }]} />

                        {/* Bank header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <View style={[styles.bankIcon, { backgroundColor: bank?.color ?? '#333' }]}>
                                <Text style={styles.bankIconText}>{bank?.initials}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.modalBankName, { color: theme.colors.textPrimary }]}>{bank?.name}</Text>
                                <Text style={{ fontSize: 12, color: Colors.brand.emerald, fontWeight: '600' }}>
                                    Secure read-only connection
                                </Text>
                            </View>
                        </View>

                        {/* Trust row */}
                        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
                            {TRUST_CHIPS.map((c) => (
                                <View key={c.label} style={[styles.chip, { backgroundColor: `${Colors.brand.emerald}15`, borderColor: `${Colors.brand.emerald}40` }]}>
                                    <Ionicons name={c.icon} size={12} color={Colors.brand.emerald} />
                                    <Text style={{ fontSize: 11, color: Colors.brand.emerald, fontWeight: '600' }}>{c.label}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Inputs */}
                        <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Online Banking Username</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                            placeholder="Enter your username"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Password</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                            placeholder="Enter your password"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textAlign: 'center', marginTop: 4, marginBottom: 20, lineHeight: 16 }}>
                            Your credentials are never stored. OLFi only receives read-only account data via{' '}
                            <Text style={{ fontWeight: '700' }}>Lean Technologies</Text>
                            , licensed by CBUAE
                        </Text>

                        {/* Connect button */}
                        <TouchableOpacity
                            onPress={() => { if (!loading) setLoading(true); }}
                            disabled={loading || !username || !password}
                            activeOpacity={0.8}
                            style={{ opacity: (!username || !password || loading) ? 0.5 : 1 }}
                        >
                            <LinearGradient
                                colors={['#011819', '#0A2525']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.connectBtn}
                            >
                                {loading ? (
                                    <>
                                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                            <Ionicons name="sync" size={18} color="#fff" />
                                        </Animated.View>
                                        <Text style={styles.connectBtnText}>Connecting…</Text>
                                    </>
                                ) : (
                                    <>
                                        <Ionicons name="lock-closed" size={18} color="#fff" />
                                        <Text style={styles.connectBtnText}>Connect securely</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function OpenBankingScreen() {
    const { theme } = useTheme();
    const { user, setPostAuthSetupPending } = useAuth();

    // Multi-select: set of connected bank IDs
    const [connectedBanks, setConnectedBanks] = useState<Set<BankId>>(new Set());
    // Which bank's modal is open
    const [modalBank, setModalBank] = useState<BankId | null>(null);

    const modalBankData = UAE_BANKS.find((b) => b.id === modalBank);

    const handleBankPress = (bankId: BankId) => {
        if (connectedBanks.has(bankId)) {
            // Already connected — toggle off
            setConnectedBanks((prev) => {
                const next = new Set(prev);
                next.delete(bankId);
                return next;
            });
        } else {
            // Open mock login
            setModalBank(bankId);
        }
    };

    const handleModalSuccess = () => {
        if (modalBank) {
            setConnectedBanks((prev) => new Set([...prev, modalBank]));
        }
        setModalBank(null);
    };

    const handleComplete = async () => {
        if (user) {
            await AsyncStorage.setItem(`buyout_ob_completed_${user.id}`, 'true');
        }
        setPostAuthSetupPending(false);
        router.replace('/(tabs)');
    };

    const hasConnected = connectedBanks.size > 0;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header logos */}
                <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 28 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <Image
                            source={require('@/assets/images/olfi-icon.png')}
                            style={{ width: 44, height: 44, borderRadius: 11 }}
                        />
                        <Ionicons name="swap-horizontal" size={22} color={theme.colors.textSecondary} />
                        <View style={[styles.leanBadge, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                            <Text style={{ color: theme.colors.textPrimary, fontSize: 11, fontWeight: '800' }}>LEAN</Text>
                        </View>
                    </View>
                </View>

                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    Connect your bank safely
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    OLFi uses Open Banking powered by{' '}
                    <Text style={{ fontWeight: '800', color: theme.colors.textPrimary }}>Lean Technologies</Text>
                    {' '}to securely read your transactions and find you the best Sharia-compliant buyout offer
                </Text>

                {/* Trust chips (above bank list) */}
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                    {TRUST_CHIPS.map((item) => (
                        <View
                            key={item.label}
                            style={[styles.chip, { backgroundColor: `${Colors.brand.emerald}12`, borderColor: `${Colors.brand.emerald}35` }]}
                        >
                            <Ionicons name={item.icon} size={13} color={Colors.brand.emerald} />
                            <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.brand.emerald }}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Section label */}
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Select one or more banks
                </Text>

                {/* Bank list — vertical scrollable fixed area */}
                <View style={[styles.bankListContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    {UAE_BANKS.map((bank, index) => {
                        const connected = connectedBanks.has(bank.id);
                        return (
                            <React.Fragment key={bank.id}>
                                {index > 0 && (
                                    <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                                )}
                                <TouchableOpacity
                                    onPress={() => handleBankPress(bank.id)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.bankRow,
                                        connected && { backgroundColor: `${bank.color}10` },
                                    ]}
                                >
                                    {/* Color dot / bank icon */}
                                    <View style={[styles.bankAvatar, { backgroundColor: bank.color }]}>
                                        <Text style={styles.bankAvatarText}>{bank.initials}</Text>
                                    </View>

                                    {/* Name */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.bankName, { color: theme.colors.textPrimary }]}>
                                            {bank.shortName}
                                        </Text>
                                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                            {bank.name}
                                        </Text>
                                    </View>

                                    {/* Status */}
                                    {connected ? (
                                        <View style={[styles.connectedBadge, { backgroundColor: Colors.brand.emerald }]}>
                                            <Ionicons name="checkmark" size={12} color="#fff" />
                                            <Text style={styles.connectedText}>Connected</Text>
                                        </View>
                                    ) : (
                                        <View style={[styles.connectChip, { borderColor: theme.colors.border }]}>
                                            <Text style={[styles.connectChipText, { color: theme.colors.textSecondary }]}>Connect</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </React.Fragment>
                        );
                    })}
                </View>

                {/* Connected count */}
                {hasConnected && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 4 }}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.brand.emerald} />
                        <Text style={{ fontSize: 13, color: Colors.brand.emerald, fontWeight: '700' }}>
                            {connectedBanks.size} bank{connectedBanks.size > 1 ? 's' : ''} connected
                        </Text>
                    </View>
                )}

                {/* CTA */}
                <TouchableOpacity
                    onPress={handleComplete}
                    activeOpacity={0.85}
                    style={{ marginTop: 20 }}
                >
                    <LinearGradient
                        colors={hasConnected ? (theme.gradients.brand as [string, string]) : ['#011819', '#0A2525']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaBtn}
                    >
                        <Ionicons name={hasConnected ? 'arrow-forward-circle' : 'arrow-forward'} size={20} color="#fff" />
                        <Text style={styles.ctaBtnText}>
                            {hasConnected ? 'Continue to OLFi' : 'Continue without connecting'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Powered by */}
                <View style={{ alignItems: 'center', marginTop: 20, gap: 2 }}>
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                        Powered by{' '}
                        <Text style={{ fontWeight: '700' }}>Lean Technologies</Text>
                        {' '}· Licensed by CBUAE
                    </Text>
                </View>
            </ScrollView>

            {/* Mock Bank Login Modal */}
            <MockLoginModal
                visible={modalBank !== null}
                bank={modalBankData}
                onSuccess={handleModalSuccess}
                onDismiss={() => setModalBank(null)}
            />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 22,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
    },
    bankListContainer: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        maxHeight: 400,
    },
    bankRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 64,
    },
    bankAvatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    bankAvatarText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 9,
    },
    bankName: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 1,
    },
    connectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    connectedText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    connectChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
    },
    connectChipText: {
        fontSize: 11,
        fontWeight: '600',
    },
    ctaBtn: {
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    ctaBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
    leanBadge: {
        width: 44,
        height: 44,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    // Modal styles
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalBankName: {
        fontSize: 16,
        fontWeight: '800',
    },
    bankIcon: {
        width: 44,
        height: 44,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bankIconText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 10,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 14,
        fontSize: 15,
    },
    connectBtn: {
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    connectBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
