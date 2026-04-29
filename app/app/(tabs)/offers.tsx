import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Hooks
import { useOffersData } from '@/hooks/useOffersData';

// Components
import AddLoanBanner from '@/components/offers/AddLoanBanner';
import FilterModal from '@/components/offers/FilterModal';
import LoanSelection from '@/components/offers/LoanSelection';
import ConsolidationOffers from '@/components/offers/ConsolidationOffers';
import OfferList from '@/components/offers/OfferList';

export default function OffersScreen() {
    const { theme } = useTheme();
    const { t, isRtl } = useLanguage();
    const [showFilterModal, setShowFilterModal] = useState(false);

    const {
        selectedOffer,
        setSelectedOffer,
        products,
        userLoans,
        recommendations,
        loading,
        refreshing,
        setRefreshing,
        activeFilters,
        selectedBanks,
        selectedLoanIds,
        consolidationOffers,
        filteredProducts,
        toggleLoanSelection,
        selectAllLoans,
        toggleFilter,
        toggleBank,
        clearAllFilters,
        loadAll,
    } = useOffersData();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadAll();
    }, [loadAll, setRefreshing]);

    const totalActiveFilters = activeFilters.length + selectedBanks.length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.bg }]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                        {t('offers.subtitle')}
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        {t('offers.title')}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowFilterModal(true)}
                    activeOpacity={0.7}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: BorderRadius.md,
                        backgroundColor: totalActiveFilters > 0
                            ? `${Colors.brand.emerald}15`
                            : theme.colors.card,
                        borderWidth: 1,
                        borderColor: totalActiveFilters > 0
                            ? Colors.brand.emerald
                            : theme.colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons
                        name="options-outline"
                        size={20}
                        color={totalActiveFilters > 0 ? Colors.brand.emerald : theme.colors.textSecondary}
                    />
                    {totalActiveFilters > 0 && (
                        <View
                            style={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                backgroundColor: Colors.brand.emerald,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>
                                {totalActiveFilters}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.brand.emerald}
                        colors={[Colors.brand.emerald]}
                    />
                }
                entering={FadeInUp.duration(600).springify()}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.brand.emerald} />
                        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                            Finding the best rates...
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Banner if user has no loans */}
                        <AddLoanBanner userLoans={userLoans} loading={loading} />

                        {/* Consolidation Section */}
                        <LoanSelection
                            userLoans={userLoans}
                            selectedLoanIds={selectedLoanIds}
                            toggleLoanSelection={toggleLoanSelection}
                            selectAllLoans={selectAllLoans}
                        />
                        <ConsolidationOffers consolidationOffers={consolidationOffers} />

                        {/* All Products */}
                        <OfferList
                            filteredProducts={filteredProducts}
                            recommendations={recommendations}
                            activeFilters={activeFilters}
                            selectedBanks={selectedBanks}
                            selectedOffer={selectedOffer}
                            setSelectedOffer={setSelectedOffer}
                        />
                    </>
                )}
            </Animated.ScrollView>

            {/* Filter Modal */}
            <FilterModal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                selectedBanks={selectedBanks}
                toggleBank={toggleBank}
                products={products}
                onClearAll={clearAllFilters}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Platform.OS === 'android' ? Spacing.xl : 10,
        paddingBottom: Spacing.xl,
    },
    greeting: {
        ...Typography.body,
        fontWeight: '500',
        marginBottom: Spacing.xs,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120, // Space for tab bar
    },
    loadingContainer: {
        paddingTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: Spacing.lg,
        ...Typography.body,
        fontWeight: '500',
    },
});
