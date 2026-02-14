import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth-context';
import { Colors } from '@/lib/constants';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter your email and password.');
            return;
        }
        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);
        if (error) {
            Alert.alert('Login Failed', error.message);
        } else {
            router.replace('/(tabs)');
        }
    };

    const handleSocialLogin = (provider: string) => {
        Alert.alert(
            'Coming Soon',
            `${provider} sign-in will be available in a future update.`,
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.dark.primary }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo / Brand */}
                    <View style={{ alignItems: 'center', marginBottom: 48 }}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{
                                width: 200,
                                height: 60,
                                marginBottom: 16,
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontSize: 15,
                                color: Colors.text.dark.secondary,
                                marginTop: 4,
                            }}
                        >
                            Smart loan management for UAE
                        </Text>
                    </View>

                    {/* Email Input */}
                    <View style={{ marginBottom: 16 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: Colors.text.dark.secondary,
                                marginBottom: 8,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Email
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Colors.dark.secondary,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: Colors.dark.tertiary,
                                paddingHorizontal: 16,
                            }}
                        >
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={Colors.text.dark.tertiary}
                            />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your@email.com"
                                placeholderTextColor={Colors.text.dark.disabled}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                style={{
                                    flex: 1,
                                    paddingVertical: 16,
                                    paddingLeft: 12,
                                    fontSize: 15,
                                    color: Colors.text.dark.primary,
                                }}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={{ marginBottom: 24 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: Colors.text.dark.secondary,
                                marginBottom: 8,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Password
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: Colors.dark.secondary,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: Colors.dark.tertiary,
                                paddingHorizontal: 16,
                            }}
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={Colors.text.dark.tertiary}
                            />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.text.dark.disabled}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                                style={{
                                    flex: 1,
                                    paddingVertical: 16,
                                    paddingLeft: 12,
                                    fontSize: 15,
                                    color: Colors.text.dark.primary,
                                }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={Colors.text.dark.tertiary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={Colors.gradients.brand as unknown as [string, string]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingVertical: 16,
                                borderRadius: 14,
                                alignItems: 'center',
                                opacity: loading ? 0.7 : 1,
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

                    {/* Divider */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 24,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: Colors.dark.tertiary,
                            }}
                        />
                        <Text
                            style={{
                                marginHorizontal: 16,
                                fontSize: 13,
                                color: Colors.text.dark.tertiary,
                            }}
                        >
                            or continue with
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: Colors.dark.tertiary,
                            }}
                        />
                    </View>

                    {/* Social Login Buttons */}
                    <View
                        style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.dark.secondary,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: Colors.dark.tertiary,
                                paddingVertical: 14,
                                gap: 8,
                            }}
                            activeOpacity={0.7}
                            onPress={() => handleSocialLogin('Google')}
                        >
                            <Ionicons name="logo-google" size={20} color="#DB4437" />
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: Colors.text.dark.primary,
                                }}
                            >
                                Google
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.dark.secondary,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: Colors.dark.tertiary,
                                paddingVertical: 14,
                                gap: 8,
                            }}
                            activeOpacity={0.7}
                            onPress={() => handleSocialLogin('Apple')}
                        >
                            <Ionicons name="logo-apple" size={20} color="#fff" />
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: Colors.text.dark.primary,
                                }}
                            >
                                Apple
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Link */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: Colors.text.dark.secondary,
                            }}
                        >
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text
                                style={{
                                    fontSize: 15,
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
        </View>
    );
}
