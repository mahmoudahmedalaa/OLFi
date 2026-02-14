import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, Spacing, BorderRadius } from '@/lib/constants';

const { width } = Dimensions.get('window');

// Mock data for demonstration
const mockTotalDebt = 285000;
const mockMonthlyPayment = 4750;
const mockPotentialSavings = 12400;

export default function DashboardScreen() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.primary }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.text.dark.secondary,
                  fontWeight: '500',
                }}
              >
                Good {getGreeting()} 👋
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: Colors.text.dark.primary,
                  marginTop: 2,
                }}
              >
                {firstName}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.dark.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.dark.tertiary,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={Colors.text.dark.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Debt Summary Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <LinearGradient
            colors={['#1E293B', '#0F172A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: BorderRadius.xl,
              padding: 24,
              borderWidth: 1,
              borderColor: Colors.dark.tertiary,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: Colors.text.dark.secondary,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Total Outstanding
            </Text>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '700',
                color: Colors.text.dark.primary,
                marginTop: 8,
                letterSpacing: -1,
              }}
            >
              AED {mockTotalDebt.toLocaleString()}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                gap: 24,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: Colors.text.dark.tertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  Monthly EMI
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: Colors.text.dark.primary,
                  }}
                >
                  AED {mockMonthlyPayment.toLocaleString()}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: Colors.dark.tertiary }} />
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: Colors.text.dark.tertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  Potential Savings
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: Colors.brand.emerald,
                  }}
                >
                  AED {mockPotentialSavings.toLocaleString()}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.text.dark.primary,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <QuickActionCard
              icon="add-circle"
              label="Add Loan"
              color={Colors.brand.emerald}
              onPress={() => { }}
            />
            <QuickActionCard
              icon="calculator"
              label="Calculator"
              color={Colors.brand.teal}
              onPress={() => { }}
            />
            <QuickActionCard
              icon="swap-horizontal"
              label="Compare"
              color={Colors.info}
              onPress={() => router.push('/(tabs)/offers')}
            />
            <QuickActionCard
              icon="document-text"
              label="Documents"
              color={Colors.warning}
              onPress={() => { }}
            />
          </View>
        </View>

        {/* Active Loans Preview */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: Colors.text.dark.primary,
              }}
            >
              Active Loans
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/loans')}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: Colors.brand.emerald,
                }}
              >
                See All →
              </Text>
            </TouchableOpacity>
          </View>

          <LoanPreviewCard
            bankName="Emirates NBD"
            type="Personal Loan"
            amount={150000}
            rate={5.49}
            remaining={120000}
            emi={2800}
            progress={0.2}
          />
          <View style={{ height: 12 }} />
          <LoanPreviewCard
            bankName="ADCB"
            type="Auto Loan"
            amount={85000}
            rate={3.99}
            remaining={65000}
            emi={1950}
            progress={0.24}
          />
        </View>

        {/* Refinance CTA */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={Colors.gradients.premium as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: BorderRadius.xl,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: 4,
                  }}
                >
                  Save AED {mockPotentialSavings.toLocaleString()}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Check refinance options from 8 UAE banks
                </Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper functions & sub-components

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function QuickActionCard({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: Colors.dark.secondary,
        borderRadius: BorderRadius.lg,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.tertiary,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: `${color}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: Colors.text.dark.secondary,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function LoanPreviewCard({
  bankName,
  type,
  amount,
  rate,
  remaining,
  emi,
  progress,
}: {
  bankName: string;
  type: string;
  amount: number;
  rate: number;
  remaining: number;
  emi: number;
  progress: number;
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.dark.secondary,
        borderRadius: BorderRadius.lg,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.dark.tertiary,
      }}
      activeOpacity={0.8}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.text.dark.primary,
            }}
          >
            {bankName}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: Colors.text.dark.tertiary,
              marginTop: 2,
            }}
          >
            {type} • {rate}% APR
          </Text>
        </View>
        <View
          style={{
            backgroundColor: `${Colors.brand.emerald}15`,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: Colors.brand.emerald,
            }}
          >
            ACTIVE
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View>
          <Text
            style={{
              fontSize: 11,
              color: Colors.text.dark.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Remaining
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.text.dark.primary,
              marginTop: 2,
            }}
          >
            AED {remaining.toLocaleString()}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 11,
              color: Colors.text.dark.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Monthly EMI
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: Colors.text.dark.primary,
              marginTop: 2,
            }}
          >
            AED {emi.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: Colors.dark.tertiary,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: Colors.brand.emerald,
            borderRadius: 2,
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 11,
          color: Colors.text.dark.tertiary,
          marginTop: 6,
          textAlign: 'right',
        }}
      >
        {Math.round(progress * 100)}% paid of AED {amount.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
}
