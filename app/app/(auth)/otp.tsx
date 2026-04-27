import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';

export default function OTPScreen() {
    const params = useLocalSearchParams();
    const action = params.action as string;
    const firstName = (params.firstName as string) || '';
    const lastName = (params.lastName as string) || '';
    const email = (params.email as string) || '';
    const password = (params.password as string) || '';

    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { theme } = useTheme();
    const inputs = useRef<Array<TextInput | null>>([]);

    // For mocking OTP, if they type 1111 we simulate error, else success.
    const handleVerify = async () => {
        const otpStr = code.join('');
        if (otpStr.length < 4) {
            Alert.alert('Error', 'Please enter the 4-digit code.');
            return;
        }

        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (otpStr === '1111') {
            setLoading(false);
            Alert.alert('Error', 'Invalid code, please try again.');
            return;
        }

        if (action === 'signup') {
            try {
                const { error } = await signUp(email, password, firstName, lastName);
                if (error) {
                    Alert.alert('Signup Error', error.message);
                } else {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await supabase.from('profiles').upsert({
                            id: user.id,
                            first_name: firstName,
                            last_name: lastName,
                            full_name: `${firstName} ${lastName}`,
                            email: email,
                        });
                    }
                    // Navigate to KYC step 1 (post-auth setup flow)
                    router.replace('/(auth)/kyc/step1' as any);
                }
            } catch (e: any) {
                Alert.alert('Error', e.message);
            }
        }
        setLoading(false);
    };

    const handleTextChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto focus next
        if (text && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingBottom: 32,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginTop: 8, marginBottom: 32 }}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.colors.textPrimary}
                        />
                    </TouchableOpacity>

                    <Text
                        style={{
                            fontSize: 32,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                            marginBottom: 16,
                            letterSpacing: -0.5,
                        }}
                    >
                        Enter 4-digit code
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: theme.colors.textSecondary,
                            marginBottom: 40,
                            lineHeight: 24,
                        }}
                    >
                        We just sent an authentication code to{'\n'}
                        <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                            {email || '+971 50 *** **12'}
                        </Text>
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 48 }}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref; }}
                                style={{
                                    width: 64,
                                    height: 72,
                                    backgroundColor: theme.colors.card,
                                    borderRadius: BorderRadius.md,
                                    borderWidth: 1,
                                    borderColor: digit ? Colors.brand.teal : theme.colors.border,
                                    fontSize: 32,
                                    fontWeight: '600',
                                    color: theme.colors.textPrimary,
                                    textAlign: 'center',
                                }}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleTextChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleVerify}
                        disabled={loading || code.join('').length < 4}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={code.join('').length < 4 ? [theme.colors.card, theme.colors.card] : theme.gradients.brand}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                borderRadius: BorderRadius.md,
                                height: 56,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: code.join('').length < 4 ? theme.colors.textDisabled : '#fff',
                                    }}
                                >
                                    Verify & Continue
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ marginTop: 24, alignItems: 'center' }}
                        onPress={async () => {
                            setLoading(true);
                            if (action === 'signup') {
                                try {
                                    const { error } = await signUp(email, password, firstName, lastName);
                                    if (error) {
                                        Alert.alert('Signup Error', error.message);
                                    } else {
                                        const { data: { user } } = await supabase.auth.getUser();
                                        if (user) {
                                            await supabase.from('profiles').upsert({
                                                id: user.id,
                                                first_name: firstName,
                                                last_name: lastName,
                                                full_name: `${firstName} ${lastName}`,
                                                email: email,
                                            });
                                        }
                                        router.replace('/(auth)/kyc/step1' as any);
                                    }
                                } catch (e: any) {
                                    Alert.alert('Error', e.message);
                                }
                            } else {
                                router.replace('/(auth)/kyc/step1' as any);
                            }
                            setLoading(false);
                        }}
                    >
                        <Text style={{ fontSize: 15, color: theme.colors.textPrimary, fontWeight: '600' }}>
                            Skip Verification (Test Mode)
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
