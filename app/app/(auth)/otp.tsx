import React, { useState, useRef } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData ,
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

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const { signUp, setPostAuthSetupPending } = useAuth();
    const { theme } = useTheme();
    const inputs = useRef<(TextInput | null)[]>([]);

    // Mock OTP: 123456 = success, anything else = error
    const handleVerify = async () => {
        const otpStr = code.join('');
        if (otpStr.length < 6) {
            Alert.alert('Error', 'Please enter the 6-digit code.');
            return;
        }

        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (otpStr !== '123456') {
            setLoading(false);
            Alert.alert('Invalid Code', 'Incorrect code. Use 123456 for TestFlight testing.');
            return;
        }

        if (action === 'signup') {
            // Gate dashboard redirect early so the auth listener doesn't route away when session is created
            setPostAuthSetupPending(true);
            try {
                const { error } = await signUp(email, password, firstName, lastName);
                if (error) {
                    setPostAuthSetupPending(false);
                    setLoading(false);
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
                    // Note: do NOT setLoading(false) here - component will unmount
                    router.replace('/(auth)/kyc/step1' as any);
                }
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : 'An unexpected error occurred';
                setPostAuthSetupPending(false);
                setLoading(false);
                Alert.alert('Error', message);
            }
        }
    };

    const handleTextChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto focus next
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
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
                        Enter 6-digit code
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

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref; }}
                                style={{
                                    width: 48,
                                    height: 64,
                                    backgroundColor: theme.colors.card,
                                    borderRadius: BorderRadius.md,
                                    borderWidth: 1,
                                    borderColor: digit ? Colors.brand.teal : theme.colors.border,
                                    fontSize: 28,
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
                        disabled={loading || code.join('').length < 6}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={code.join('').length < 6 ? [theme.colors.card, theme.colors.card] : theme.gradients.brand}
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
                                        color: code.join('').length < 6 ? theme.colors.textDisabled : '#fff',
                                    }}
                                >
                                    Verify & Continue
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
