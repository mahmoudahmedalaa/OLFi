import React from 'react';
import { View, TextInput } from 'react-native';
import { BorderRadius } from '@/lib/constants';

interface FormInputProps {
    theme: any;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'numeric' | 'default';
}

export default function FormInput({
    theme,
    placeholder,
    value,
    onChangeText,
    keyboardType,
}: FormInputProps) {
    return (
        <View
            style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                paddingHorizontal: 16,
                height: 52,
                justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <TextInput
                style={{
                    fontSize: 15,
                    color: theme.colors.textPrimary,
                }}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textDisabled}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType || 'default'}
            />
        </View>
    );
}
