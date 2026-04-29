import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { Colors, Spacing, Typography } from '@/lib/constants';
import IngestionOptionCard from '@/components/add-loan/IngestionOptionCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { ActivityIndicator } from 'react-native';

export default function AddLoanGatewayScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();

    const [isScanning, setIsScanning] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStep, setConnectionStep] = useState(0);

    const handleSimulateOCR = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            router.push('/add-loan-manual?prefill=true');
        }, 2500);
    };

    const handleConnectLean = async () => {
        if (!user) return;
        setIsConnecting(true);
        setConnectionStep(1); // Authenticating...

        setTimeout(() => setConnectionStep(2), 1500); // Fetching debts...

        setTimeout(async () => {
            // Inject mock DB debts
            try {
                await supabase.from('user_loans').insert([
                    {
                        user_id: user.id,
                        bank_name: 'Emirates NBD',
                        loan_type: 'personal',
                        original_amount: 250000,
                        remaining_amount: 180000,
                        interest_rate: 6.99,
                        monthly_emi: 4500,
                        status: 'active',
                        tenure_months: 60,
                        start_date: new Date('2023-01-15').toISOString(),
                    },
                    {
                        user_id: user.id,
                        bank_name: 'ADCB',
                        loan_type: 'auto',
                        original_amount: 80000,
                        remaining_amount: 45000,
                        interest_rate: 4.5,
                        monthly_emi: 1650,
                        status: 'active',
                        tenure_months: 48,
                        start_date: new Date('2022-06-10').toISOString(),
                    }
                ]);
            } catch (error) {
                console.error("Error inserting mock debts", error);
            }
            setIsConnecting(false);
            router.replace('/(tabs)');
        }, 3000);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: Spacing.xl,
                    paddingVertical: Spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ ...Typography.body, fontWeight: '600', color: theme.colors.textPrimary }}>
                    Add Debt
                </Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
                <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: Spacing.sm }}>
                    How would you like to add your debt?
                </Text>
                <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: Spacing['2xl'] }}>
                    Choose the fastest way to bring your debt details into OLFi.
                </Text>

                <IngestionOptionCard
                    isPrimary
                    icon="flash"
                    title="Auto-Sync via Open Banking"
                    description="Securely connect your bank account via Lean Technologies to instantly sync all active debts."
                    tag="MOCK"
                    onPress={handleConnectLean}
                />

                <IngestionOptionCard
                    icon="document-text"
                    title="Upload Statement"
                    description="Upload a PDF of your bank statement and we will automatically extract your debt details."
                    tag="PROTOTYPE"
                    onPress={handleSimulateOCR}
                />

                <IngestionOptionCard
                    icon="create"
                    title="Enter Manually"
                    description="Type in the details of your debt yourself based on your most recent bank statement."
                    onPress={() => router.push('/add-loan-manual')}
                />
            </ScrollView>

            {/* Mock Connecting Overlay */}
            {isConnecting && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                }}>
                    <View style={{
                        backgroundColor: theme.colors.cardElevated,
                        padding: Spacing['2xl'],
                        borderRadius: 24,
                        alignItems: 'center',
                        width: '85%'
                    }}>
                        <Ionicons name="link-outline" size={48} color={Colors.brand.emerald} style={{ marginBottom: Spacing.lg }} />
                        <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' }}>
                            {connectionStep === 1 ? 'Authenticating with Lean...' : 'Discovering your debts...'}
                        </Text>
                        <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }}>
                            Securely scanning linked accounts for liabilities.
                        </Text>
                        <ActivityIndicator color={Colors.brand.emerald} style={{ marginTop: Spacing.lg }} />
                    </View>
                </View>
            )}

            {/* Mock Scanning Overlay */}
            {isScanning && (
                <View style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                }}>
                    <View style={{
                        backgroundColor: theme.colors.cardElevated,
                        padding: Spacing['2xl'],
                        borderRadius: 24,
                        alignItems: 'center',
                        width: '80%'
                    }}>
                        <Ionicons name="scan-outline" size={48} color={Colors.brand.emerald} style={{ marginBottom: Spacing.lg }} />
                        <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, marginBottom: Spacing.sm }}>
                            Analyzing Document...
                        </Text>
                        <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center' }}>
                            Extracting Principal, Tenure, and Interest Rate using OLFi AI.
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
