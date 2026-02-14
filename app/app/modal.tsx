import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';

export default function ModalScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.dark.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: Colors.text.dark.primary,
          marginBottom: 16,
        }}
      >
        Modal
      </Text>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.dark.secondary,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: BorderRadius.md,
          gap: 8,
        }}
      >
        <Ionicons name="arrow-back" size={18} color={Colors.text.dark.primary} />
        <Text style={{ fontSize: 15, color: Colors.text.dark.primary }}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}
