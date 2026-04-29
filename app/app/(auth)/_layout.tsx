import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="kyc/step1" />
            <Stack.Screen name="kyc/face" />
            <Stack.Screen name="biometric-setup" />
            <Stack.Screen name="open-banking" />
        </Stack>
    );
}
