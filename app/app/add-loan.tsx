import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { Colors, Spacing, Typography } from '@/lib/constants';
import IngestionOptionCard from '@/components/add-loan/IngestionOptionCard';
import ComingSoonModal from '@/components/ComingSoonModal';

export default function AddLoanGatewayScreen() {
    const { theme } = useTheme();
    const [showLeanModal, setShowLeanModal] = useState(false);
    const [showOCRModal, setShowOCRModal] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleSimulateOCR = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            router.push('/add-loan-manual?prefill=true');
        }, 2500);
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
                    Add Loan
                </Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
                <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: Spacing.sm }}>
                    How would you like to add your loan?
                </Text>
                <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: Spacing['2xl'] }}>
                    Choose the fastest way to bring your loan details into OLFi.
                </Text>

                <IngestionOptionCard
                    isPrimary
                    icon="flash"
                    title="Auto-Sync via Open Banking"
                    description="Securely connect your bank account via Lean Technologies to instantly sync all active loans."
                    tag="COMING SOON"
                    onPress={() => setShowLeanModal(true)}
                />

                <IngestionOptionCard
                    icon="document-text"
                    title="Upload Statement"
                    description="Upload a PDF of your bank statement and we will automatically extract your loan details."
                    tag="PROTOTYPE"
                    onPress={handleSimulateOCR}
                />

                <IngestionOptionCard
                    icon="create"
                    title="Enter Manually"
                    description="Type in the details of your loan yourself based on your most recent bank statement."
                    onPress={() => router.push('/add-loan-manual')}
                />
            </ScrollView>

            <ComingSoonModal
                visible={showLeanModal}
                onClose={() => setShowLeanModal(false)}
                title="Open Banking Integration"
                description="We're partnering with Lean Technologies to securely link your UAE bank accounts and auto-sync your loans in real time. This feature is currently in development."
            />

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
