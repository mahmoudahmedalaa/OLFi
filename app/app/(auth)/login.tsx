import React, { useState } from 'react';
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
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { theme } = useTheme();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) Alert.alert('Login Error', error.message);
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
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
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo & Welcome */}
                    <View style={{ alignItems: 'center', marginTop: 48, marginBottom: 40 }}>
                        <Image
                            source={require('@/assets/images/icon.png')}
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 18,
                                marginBottom: 24,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: '700',
                                color: theme.colors.textPrimary,
                                marginBottom: 8,
                            }}
                        >
                            Welcome back
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '500',
                                color: Colors.brand.teal,
                                textAlign: 'center',
                                fontStyle: 'italic',
                                letterSpacing: 0.3,
                            }}
                        >
                            your debt, rewritten
                        </Text>
                    </View>

                    {/* Email */}
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: theme.colors.textSecondary,
                            marginBottom: 8,
                        }}
                    >
                        Email
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            paddingHorizontal: 16,
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            height: 52,
                        }}
                    >
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color={theme.colors.textTertiary}
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                fontSize: 15,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="your@email.com"
                            placeholderTextColor={theme.colors.textDisabled}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password */}
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: theme.colors.textSecondary,
                            marginBottom: 8,
                        }}
                    >
                        Password
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            paddingHorizontal: 16,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            height: 52,
                        }}
                    >
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={theme.colors.textTertiary}
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                fontSize: 15,
                                color: theme.colors.textPrimary,
                            }}
                            placeholder="••••••••"
                            placeholderTextColor={theme.colors.textDisabled}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={theme.colors.textTertiary}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                        <LinearGradient
                            colors={theme.gradients.brand}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                borderRadius: BorderRadius.md,
                                height: 52,
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
                                        color: '#fff',
                                    }}
                                >
                                    Sign In
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        style={{ alignItems: 'center', marginTop: 16 }}
                        onPress={() => {
                            Alert.prompt(
                                'Reset Password',
                                'Enter your email address and we\'ll send you a password reset link.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Send Reset Link',
                                        onPress: async (inputEmail?: string) => {
                                            const resetEmail = (inputEmail || email).trim();
                                            if (!resetEmail) {
                                                Alert.alert('Error', 'Please enter your email address.');
                                                return;
                                            }
                                            try {
                                                const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                                                    redirectTo: 'buyout://reset-password',
                                                });
                                                if (error) throw error;
                                                Alert.alert(
                                                    'Check Your Email ✉️',
                                                    `We've sent a password reset link to ${resetEmail}. Check your inbox (and spam folder).`
                                                );
                                            } catch (e: any) {
                                                Alert.alert('Error', e.message || 'Failed to send reset email.');
                                            }
                                        },
                                    },
                                ],
                                'plain-text',
                                email
                            );
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '500',
                                color: Colors.brand.emerald,
                            }}
                        >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 32,
                        }}
                    >
                        <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.colors.textTertiary,
                                marginHorizontal: 16,
                            }}
                        >
                            or
                        </Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
                    </View>

                    {/* Social Login */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            height: 52,
                            gap: 10,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="logo-apple" size={20} color={theme.colors.textPrimary} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: theme.colors.textPrimary,
                            }}
                        >
                            Continue with Apple
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 32,
                            gap: 4,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: Colors.brand.emerald,
                                }}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
