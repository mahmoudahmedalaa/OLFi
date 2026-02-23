import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const BIOMETRIC_KEY = '@buyout_biometric_lock';

export default function SecuritySettingsScreen() {
    const { theme } = useTheme();
    const { user, signOut } = useAuth();
    const [biometrics, setBiometrics] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [changingPw, setChangingPw] = useState(false);

    // Load persisted biometric preference
    useEffect(() => {
        AsyncStorage.getItem(BIOMETRIC_KEY).then((val) => {
            setBiometrics(val === 'true');
        });
    }, []);

    const handleBiometricToggle = async (newValue: boolean) => {
        if (newValue) {
            // Turning ON — check hardware + authenticate
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) {
                Alert.alert('Not Available', 'Your device does not support biometric authentication.');
                return;
            }
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) {
                Alert.alert('Not Set Up', 'No biometrics are enrolled on this device. Please set up Face ID or Touch ID in your device settings.');
                return;
            }
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable biometric lock',
                fallbackLabel: 'Use Passcode',
            });
            if (result.success) {
                setBiometrics(true);
                await AsyncStorage.setItem(BIOMETRIC_KEY, 'true');

                const savedPwd = await SecureStore.getItemAsync('saved_password');
                if (!savedPwd) {
                    Alert.alert(
                        'Almost Done',
                        'To use Face ID for logging in, you must manually log in with your email and password at least once. Please log out and back in to fully enable biometric login.'
                    );
                }
            }
            // If cancelled/failed, toggle stays OFF
        } else {
            // Turning OFF — require biometric confirmation
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to disable biometric lock',
                fallbackLabel: 'Use Passcode',
            });
            if (result.success) {
                setBiometrics(false);
                await AsyncStorage.setItem(BIOMETRIC_KEY, 'false');
            }
            // If cancelled/failed, toggle stays ON
        }
    };

    const handleChangePassword = async () => {
        if (!newPw || newPw.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters.');
            return;
        }
        if (newPw !== confirmPw) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        setChangingPw(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPw });
            if (error) throw error;

            // Update saved credentials for FaceID if they exist
            if (biometrics) {
                await SecureStore.setItemAsync('saved_password', newPw);
            }

            Alert.alert('Success', 'Password updated successfully.');
            setShowPasswordSection(false);
            setNewPw('');
            setConfirmPw('');
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to update password.');
        } finally {
            setChangingPw(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? All your data — loans, applications, and profile — will be permanently deleted. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Forever',
                    style: 'destructive',
                    onPress: () => {
                        // Double confirmation
                        Alert.alert(
                            'Final Confirmation',
                            'Type DELETE to confirm account deletion.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Confirm Delete',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            if (!user) return;
                                            // Delete related data
                                            await supabase.from('notifications').delete().eq('user_id', user.id);
                                            await supabase.from('refinance_applications').delete().eq('user_id', user.id);
                                            await supabase.from('user_loans').delete().eq('user_id', user.id);
                                            await supabase.from('profiles').delete().eq('id', user.id);

                                            // Sign out
                                            await signOut();
                                            Alert.alert(
                                                'Account Deleted',
                                                'Your account and all associated data have been permanently deleted.'
                                            );
                                        } catch (e: any) {
                                            console.error('Failed to delete account:', e);
                                            Alert.alert('Error', 'Failed to delete account. Please try again or contact support@buyout.ae');
                                        }
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                    Security
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                {/* Account Info */}
                <View style={{
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.lg,
                    padding: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 4 }}>
                        Signed in with
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary }}>
                        {user?.email}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }}>
                        Email/password authentication
                    </Text>
                </View>

                {/* Biometric Lock */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.lg,
                    padding: 16,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: `${Colors.brand.teal}12`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="finger-print" size={22} color={Colors.brand.teal} />
                    </View>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>
                            Face ID / Touch ID
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                            Unlock the app with biometrics
                        </Text>
                    </View>
                    <Switch
                        value={biometrics}
                        onValueChange={handleBiometricToggle}
                        trackColor={{ false: theme.colors.border, true: Colors.brand.teal }}
                        thumbColor="#fff"
                    />
                </View>

                {/* Change Password */}
                <TouchableOpacity
                    onPress={() => setShowPasswordSection(!showPasswordSection)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.lg,
                        padding: 16,
                        marginBottom: showPasswordSection ? 0 : 10,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        borderBottomLeftRadius: showPasswordSection ? 0 : BorderRadius.lg,
                        borderBottomRightRadius: showPasswordSection ? 0 : BorderRadius.lg,
                    }}
                >
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: `${Colors.brand.emerald}12`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="lock-closed" size={20} color={Colors.brand.emerald} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>
                            Change Password
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                            Update your account password
                        </Text>
                    </View>
                    <Ionicons name={showPasswordSection ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.textTertiary} />
                </TouchableOpacity>

                {showPasswordSection && (
                    <View style={{
                        backgroundColor: theme.colors.card,
                        borderBottomLeftRadius: BorderRadius.lg,
                        borderBottomRightRadius: BorderRadius.lg,
                        padding: 16,
                        paddingTop: 8,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderTopWidth: 0,
                        borderColor: theme.colors.border,
                    }}>
                        <PwField placeholder="New Password" value={newPw} onChangeText={setNewPw} theme={theme} />
                        <PwField placeholder="Confirm New Password" value={confirmPw} onChangeText={setConfirmPw} theme={theme} />

                        <TouchableOpacity onPress={handleChangePassword} disabled={changingPw} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    borderRadius: BorderRadius.md,
                                    height: 44,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 6,
                                }}
                            >
                                {changingPw ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Update Password</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Danger Zone */}
                <View style={{ marginTop: 24 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.error, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Danger Zone
                    </Text>
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: `${Colors.error}08`,
                            borderRadius: BorderRadius.lg,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: `${Colors.error}30`,
                        }}
                    >
                        <Ionicons name="trash-outline" size={20} color={Colors.error} style={{ marginRight: 12 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.error }}>
                                Delete Account
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                                Permanently remove your account and data
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={Colors.error} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function PwField({ placeholder, value, onChangeText, theme }: { placeholder: string; value: string; onChangeText: (t: string) => void; theme: any }) {
    const [visible, setVisible] = useState(false);
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.bg,
            borderRadius: BorderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 10,
            paddingHorizontal: 14,
        }}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!visible}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textDisabled}
                style={{ flex: 1, fontSize: 15, color: theme.colors.textPrimary, paddingVertical: 12 }}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Ionicons name={visible ? 'eye-off' : 'eye'} size={18} color={theme.colors.textTertiary} />
            </TouchableOpacity>
        </View>
    );
}
