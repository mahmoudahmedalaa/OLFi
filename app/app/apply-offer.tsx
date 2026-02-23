import React from 'react';
import { Text, Animated, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

import { useApplyOffer } from '@/hooks/useApplyOffer';
import { CustomizeOfferStep } from '@/components/apply-offer/CustomizeOfferStep';
import { ContactDetailsStep } from '@/components/apply-offer/ContactDetailsStep';
import { OptionalRichDataStep } from '@/components/apply-offer/OptionalRichDataStep';
import { ReviewSubmitStep } from '@/components/apply-offer/ReviewSubmitStep';
import { SuccessScreen } from '@/components/apply-offer/SuccessScreen';
import { WizardHeader } from '@/components/apply-offer/WizardHeader';
import { WizardFooter } from '@/components/apply-offer/WizardFooter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ApplyOfferScreen() {
    const { theme } = useTheme();
    const offerData = useApplyOffer();

    if (offerData.verifyingOffer) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.brand.emerald} />
                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, marginTop: 12 }}>
                    Verifying offer details securely...
                </Text>
            </SafeAreaView>
        );
    }

    if (offerData.submitted) {
        return (
            <SuccessScreen
                theme={theme}
                router={offerData.router}
                params={offerData.params}
                formData={offerData.formData}
                successAnim={offerData.successAnim}
                checkmarkScale={offerData.checkmarkScale}
                dynamicMonthlySavings={offerData.dynamicMonthlySavings}
                dynamicGrossTotalSavings={offerData.dynamicGrossTotalSavings}
                dynamicTotalSavings={offerData.dynamicTotalSavings}
            />
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <WizardHeader
                theme={theme}
                step={offerData.step}
                totalSteps={offerData.totalSteps}
                animateToStep={offerData.animateToStep}
                router={offerData.router}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <Animated.View style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: SCREEN_WIDTH * offerData.totalSteps,
                    transform: [{
                        translateX: offerData.slideAnim.interpolate({
                            inputRange: [0, 1, 2, 3],
                            outputRange: [0, -SCREEN_WIDTH, -SCREEN_WIDTH * 2, -SCREEN_WIDTH * 3],
                        }),
                    }],
                }}>
                    <CustomizeOfferStep
                        theme={theme}
                        dynamicEmi={offerData.dynamicEmi}
                        dynamicMonthlySavings={offerData.dynamicMonthlySavings}
                        dynamicGrossTotalSavings={offerData.dynamicGrossTotalSavings}
                        dynamicTotalSavings={offerData.dynamicTotalSavings}
                        processingFee={offerData.params.processingFee || '0'}
                        selectedTenure={offerData.selectedTenure}
                        setSelectedTenure={offerData.setSelectedTenure}
                        maxTenureMonths={offerData.params.maxTenureMonths || '48'}
                    />

                    <ContactDetailsStep
                        theme={theme}
                        user={offerData.user}
                        params={offerData.params}
                        edgeOfferData={offerData.edgeOfferData}
                        formData={offerData.formData}
                        setFormData={offerData.setFormData}
                    />

                    <OptionalRichDataStep
                        theme={theme}
                        formData={offerData.formData}
                        setFormData={offerData.setFormData}
                    />

                    <ReviewSubmitStep
                        theme={theme}
                        user={offerData.user}
                        params={offerData.params}
                        selectedTenure={offerData.selectedTenure}
                        dynamicMonthlySavings={offerData.dynamicMonthlySavings}
                        dynamicGrossTotalSavings={offerData.dynamicGrossTotalSavings}
                        dynamicTotalSavings={offerData.dynamicTotalSavings}
                        formData={offerData.formData}
                        setFormData={offerData.setFormData}
                    />
                </Animated.View>
            </KeyboardAvoidingView>

            <WizardFooter
                theme={theme}
                step={offerData.step}
                canProceedStep0={offerData.canProceedStep0}
                canProceedStep2={offerData.canProceedStep2}
                submitting={offerData.submitting}
                animateToStep={offerData.animateToStep}
                handleSubmit={offerData.handleSubmit}
            />
        </SafeAreaView>
    );
}
