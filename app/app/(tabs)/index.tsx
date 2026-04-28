import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';

import { useDashboardData } from '@/hooks/useDashboardData';
import { DebtSummaryCard } from '@/components/dashboard/DebtSummaryCard';
import { FinancialHealthCard } from '@/components/dashboard/FinancialHealthCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { LoanPreviewCard } from '@/components/dashboard/LoanPreviewCard';
import { ScoreFlipCard } from '@/components/dashboard/ScoreFlipCard';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { t, isRtl } = useLanguage();
  const insets = useSafeAreaInsets();
  const {
    loading,
    refreshing,
    setRefreshing,
    firstName,
    unreadCount,
    activeLoans,
    totalDebt,
    totalEmi,
    dtiRatio,
    healthScore,
    interestBurden,
    potentialMonthlySavings,
    fetchLoans,
  } = useDashboardData();

  // Build avatar initials from first name
  const initials = firstName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.md,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchLoans();
            }}
            tintColor={Colors.brand.emerald}
          />
        }
      >
        {/* ── Inline Greeting Row ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.xl,
            marginBottom: Spacing.xl,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: Colors.brand.emerald + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: Spacing.md,
            }}
          >
            <Text
              style={{
                ...Typography.captionBold,
                color: Colors.brand.emerald,
              }}
            >
              {initials}
            </Text>
          </View>

          {/* Greeting Text */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...Typography.caption,
                color: theme.colors.textSecondary,
              }}
            >
              {t('dashboard.greeting')} 👋
            </Text>
            <Text
              style={{
                ...Typography.h1,
                color: theme.colors.textPrimary,
                marginTop: 2,
              }}
            >
              {firstName}
            </Text>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
            onPress={() => router.push('/notifications' as any)}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={{
                position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8,
                backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Dynamic Flip Score Card ── */}
        <ScoreFlipCard />

        {/* ── Total Debt Summary Card ── */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}>
          <DebtSummaryCard
            theme={theme}
            loading={loading}
            totalDebt={totalDebt}
            totalEmi={totalEmi}
            potentialMonthlySavings={potentialMonthlySavings}
          />
        </View>

        {/* ── Quick Actions ── */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] }}>
          <Text
            style={{
              ...Typography.h3,
              color: theme.colors.textPrimary,
              marginBottom: Spacing.lg,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <QuickActionCard
              icon="add-circle"
              label="Add Finance"
              color={Colors.brand.emerald}
              theme={theme}
              onPress={() => router.push('/add-loan' as any)}
            />
            <QuickActionCard
              icon="calculator"
              label="Calculator"
              color={Colors.brand.teal}
              theme={theme}
              onPress={() => router.push('/calculator' as any)}
            />
            <QuickActionCard
              icon="swap-horizontal"
              label="Compare"
              color={Colors.info}
              theme={theme}
              onPress={() => router.push('/(tabs)/offers')}
            />
            <QuickActionCard
              icon="school-outline"
              label="Sharia Center"
              color={Colors.brand.emerald}
              theme={theme}
              onPress={() => router.push('/sharia-center' as any)}
            />
          </View>
        </View>

        {/* ── Active Loans Preview ── */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: Spacing.lg,
            }}
          >
            <Text
              style={{
                ...Typography.h3,
                color: theme.colors.textPrimary,
              }}
            >
              Active Financing
            </Text>
            {activeLoans.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/loans')}>
                <Text
                  style={{
                    ...Typography.captionBold,
                    color: Colors.brand.emerald,
                  }}
                >
                  See All →
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={{ backgroundColor: theme.colors.card, borderRadius: BorderRadius.lg, padding: Spacing.xl, marginBottom: Spacing.lg, borderWidth: 1, borderColor: theme.colors.border }}>
              <Text style={{ color: theme.colors.textSecondary }}>Loading financing...</Text>
            </View>
          ) : activeLoans.length === 0 ? (
            <TouchableOpacity
              onPress={() => router.push('/add-loan' as any)}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: Spacing['2xl'],
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderStyle: 'dashed',
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={36} color={Colors.brand.emerald} />
              <Text
                style={{
                  ...Typography.bodyBold,
                  color: theme.colors.textPrimary,
                  marginTop: Spacing.md,
                }}
              >
                Add your first finance
              </Text>
              <Text
                style={{
                  ...Typography.caption,
                  color: theme.colors.textSecondary,
                  marginTop: Spacing.xs,
                  textAlign: 'center',
                }}
              >
                Start tracking your debts and find better rates
              </Text>
            </TouchableOpacity>
          ) : (
            activeLoans.slice(0, 3).map((loan, i) => {
              const progress =
                loan.original_amount > 0
                  ? 1 - loan.remaining_amount / loan.original_amount
                  : 0;
              return (
                <View key={loan.id}>
                  {i > 0 && <View style={{ height: Spacing.md }} />}
                  <LoanPreviewCard
                    bankName={loan.bank_name || 'Unknown Bank'}
                    type={formatLoanType(loan.loan_type)}
                    amount={loan.original_amount}
                    rate={loan.interest_rate}
                    remaining={loan.remaining_amount}
                    emi={loan.monthly_emi}
                    progress={progress}
                    theme={theme}
                    onPress={() => router.push({ pathname: '/loan-detail' as any, params: { loanId: loan.id } })}
                    savingsEstimate={loan.interest_rate > 3 ? Math.round(loan.monthly_emi * 0.08) : 0}
                  />
                </View>
              );
            })
          )}
        </View>

        {/* ── Financial Health Report Card ── */}
        {activeLoans.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] }}>
            <Text
              style={{
                ...Typography.h3,
                color: theme.colors.textPrimary,
                marginBottom: Spacing.lg,
              }}
            >
              Financial Health
            </Text>
            <FinancialHealthCard
              theme={theme}
              healthScore={healthScore}
              dtiRatio={dtiRatio}
              totalEmi={totalEmi}
              interestBurden={interestBurden}
              potentialMonthlySavings={potentialMonthlySavings}
              router={router}
            />
          </View>
        )}

        {/* ── Refinance CTA ── */}
        {totalDebt > 0 && (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/offers')}
            >
              <LinearGradient
                colors={theme.gradients.premium}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: BorderRadius.xl,
                  padding: Spacing.xl,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      ...Typography.h3,
                      fontWeight: '700',
                      color: '#fff',
                      marginBottom: Spacing.xs,
                    }}
                  >
                    Compare OLFi Offers
                  </Text>
                  <Text
                    style={{
                      ...Typography.caption,
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    Personalized recommendations for your financing
                  </Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatLoanType(type: string) {
  return type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) + ' Finance';
}
