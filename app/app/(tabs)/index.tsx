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
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

import { useDashboardData } from '@/hooks/useDashboardData';
import GlassHeader from '@/components/ui/GlassHeader';
import { DebtSummaryCard } from '@/components/dashboard/DebtSummaryCard';
import { FinancialHealthCard } from '@/components/dashboard/FinancialHealthCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { LoanPreviewCard } from '@/components/dashboard/LoanPreviewCard';

export default function DashboardScreen() {
  const { theme } = useTheme();
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {/* Glass Header */}
      <GlassHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' }}>
            Good {getGreeting()} 👋
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 2 }}>
            {firstName}
          </Text>
        </View>
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
              backgroundColor: theme.colors.textPrimary, alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </GlassHeader>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
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
        {/* Total Debt Summary Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <DebtSummaryCard
            theme={theme}
            loading={loading}
            totalDebt={totalDebt}
            totalEmi={totalEmi}
            potentialMonthlySavings={potentialMonthlySavings}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: theme.colors.textPrimary,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
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
                color: theme.colors.textPrimary,
              }}
            >
              Active Financing
            </Text>
            {activeLoans.length > 0 && (
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
            )}
          </View>

          {loading ? (
            <View style={{ backgroundColor: theme.colors.card, borderRadius: BorderRadius.lg, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border }}>
              <Text style={{ color: theme.colors.textSecondary }}>Loading financing...</Text>
            </View>
          ) : activeLoans.length === 0 ? (
            <TouchableOpacity
              onPress={() => router.push('/add-loan' as any)}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: 24,
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
                  fontSize: 15,
                  fontWeight: '600',
                  color: theme.colors.textPrimary,
                  marginTop: 12,
                }}
              >
                Add your first finance
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  marginTop: 4,
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
                  {i > 0 && <View style={{ height: 12 }} />}
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

        {/* Financial Health Report Card */}
        {activeLoans.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: theme.colors.textPrimary,
                marginBottom: 16,
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

        {/* Refinance CTA */}
        {totalDebt > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
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
                    Compare OLFi Offers
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
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
