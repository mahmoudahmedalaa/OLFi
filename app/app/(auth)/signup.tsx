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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { theme } = useTheme();

    const handleSignup = async () => {
        if (!firstName.trim() || !lastName.trim() || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const { error } = await signUp(email, password);
            if (error) {
                Alert.alert('Signup Error', error.message);
            } else {
                // Save profile with first/last name
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        full_name: `${firstName.trim()} ${lastName.trim()}`,
                        email: email,
                    });
                }
                // Navigate to tabs (auth gate will handle redirect)
                router.replace('/(tabs)');
            }
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
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginTop: 8, marginBottom: 16 }}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={theme.colors.textPrimary}
                        />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={{ marginBottom: 32 }}>
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: '700',
                                color: theme.colors.textPrimary,
                                marginBottom: 8,
                            }}
                        >
                            Create account
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: theme.colors.textSecondary,
                            }}
                        >
                            Start managing your debts smarter
                        </Text>
                    </View>

                    {/* First + Last Name Row */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="First Name"
                                icon="person-outline"
                                placeholder="Mahmoud"
                                value={firstName}
                                onChangeText={setFirstName}
                                theme={theme}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField
                                label="Last Name"
                                icon="person-outline"
                                placeholder="Ahmed"
                                value={lastName}
                                onChangeText={setLastName}
                                theme={theme}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <InputField
                        label="Email"
                        icon="mail-outline"
                        placeholder="your@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        theme={theme}
                    />

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
                            marginBottom: 16,
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
                            placeholder="Min. 6 characters"
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

                    {/* Confirm Password */}
                    <InputField
                        label="Confirm Password"
                        icon="lock-closed-outline"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        theme={theme}
                    />

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}
                        style={{ marginTop: 8 }}
                    >
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
                                    Create Account
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text
                        style={{
                            fontSize: 12,
                            color: theme.colors.textTertiary,
                            textAlign: 'center',
                            marginTop: 16,
                            lineHeight: 18,
                        }}
                    >
                        By signing up, you agree to our{' '}
                        <Text style={{ color: Colors.brand.emerald }}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={{ color: Colors.brand.emerald }}>Privacy Policy</Text>
                    </Text>

                    {/* Sign In Link */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 32,
                            gap: 4,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: Colors.brand.emerald,
                                }}
                            >
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function InputField({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
    theme,
}: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'email-address' | 'default';
    autoCapitalize?: 'none' | 'sentences';
    secureTextEntry?: boolean;
    theme: ReturnType<typeof useTheme>['theme'];
}) {
    return (
        <>
            <Text
                style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: theme.colors.textSecondary,
                    marginBottom: 8,
                }}
            >
                {label}
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
                    name={icon}
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
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textDisabled}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={autoCapitalize || 'sentences'}
                    secureTextEntry={secureTextEntry}
                />
            </View>
        </>
    );
}
