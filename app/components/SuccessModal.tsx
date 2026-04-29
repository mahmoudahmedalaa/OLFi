import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { TermTooltip } from '@/components/ui/TermTooltip';

const { width } = Dimensions.get('window');

interface LoanSummary {
    bankName: string;
    loanType: string;
    amount: number;
    rate: number;
    emi: number;
}

interface SuccessModalProps {
    visible: boolean;
    loanSummary: LoanSummary | null;
    onViewDashboard: () => void;
    onAddAnother: () => void;
}

export default function SuccessModal({
    visible,
    loanSummary,
    onViewDashboard,
    onAddAnother,
}: SuccessModalProps) {
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
            checkScale.setValue(0);

            // Animate in
            Animated.sequence([
                Animated.parallel([
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.spring(checkScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 6,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, scaleAnim, fadeAnim, checkScale]);

    const formatLoanType = (type: string) =>
        type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) + ' Loan';

    if (!loanSummary) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                }}
            >
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        opacity: fadeAnim,
                        width: width - 48,
                        maxWidth: 380,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.bg,
                            borderRadius: BorderRadius.xl,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        {/* Gradient Header */}
                        <LinearGradient
                            colors={['#011819', '#0A2525']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                paddingTop: 40,
                                paddingBottom: 32,
                                alignItems: 'center',
                            }}
                        >
                            {/* Animated Checkmark */}
                            <Animated.View
                                style={{
                                    transform: [{ scale: checkScale }],
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        backgroundColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons name="checkmark" size={36} color="#011819" />
                                </View>
                            </Animated.View>

                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: '700',
                                    color: '#fff',
                                    marginBottom: 4,
                                }}
                            >
                                Debt Added!
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: 'rgba(255,255,255,0.85)',
                                }}
                            >
                                Successfully tracked in your portfolio
                            </Text>
                        </LinearGradient>

                        {/* Loan Summary Card */}
                        <View style={{ padding: 24 }}>
                            <View
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderRadius: BorderRadius.lg,
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    marginBottom: 24,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 11,
                                        fontWeight: '600',
                                        color: theme.colors.textTertiary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        marginBottom: 12,
                                    }}
                                >
                                    Loan Summary
                                </Text>

                                <SummaryRow
                                    label="Bank"
                                    value={loanSummary.bankName}
                                    theme={theme}
                                />
                                <SummaryRow
                                    label="Type"
                                    value={formatLoanType(loanSummary.loanType)}
                                    theme={theme}
                                />
                                <SummaryRow
                                    label="Amount"
                                    value={`AED ${loanSummary.amount.toLocaleString()}`}
                                    theme={theme}
                                />
                                <SummaryRow
                                    label="Interest Rate"
                                    value={`${loanSummary.rate}%`}
                                    theme={theme}
                                />
                                <SummaryRow
                                    label="Monthly EMI"
                                    tooltip="Equated Monthly Instalment — your fixed monthly repayment covering principal and profit."
                                    value={`AED ${loanSummary.emi.toLocaleString()}`}
                                    theme={theme}
                                    isLast
                                />
                            </View>

                            {/* Buttons */}
                            <TouchableOpacity
                                onPress={onViewDashboard}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#011819', '#0A2525']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        borderRadius: BorderRadius.md,
                                        height: 52,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: '#fff',
                                        }}
                                    >
                                        View Dashboard
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onAddAnother}
                                activeOpacity={0.7}
                                style={{
                                    height: 52,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: BorderRadius.md,
                                    borderWidth: 1.5,
                                    borderColor: Colors.brand.emerald,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: Colors.brand.emerald,
                                    }}
                                >
                                    Add Another Loan
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

function SummaryRow({
    label,
    value,
    theme,
    isLast = false,
    tooltip,
}: {
    label: string;
    value: string;
    theme: ReturnType<typeof useTheme>['theme'];
    isLast?: boolean;
    tooltip?: string;
}) {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: theme.colors.border,
            }}
        >
            {tooltip ? (
                <TermTooltip
                    term={label}
                    definition={tooltip}
                    labelStyle={{ fontSize: 13, color: theme.colors.textTertiary }}
                />
            ) : (
                <Text
                    style={{
                        fontSize: 13,
                        color: theme.colors.textTertiary,
                    }}
                >
                    {label}
                </Text>
            )}
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.textPrimary,
                }}
            >
                {value}
            </Text>
        </View>
    );
}
