import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Hooks
import { useOffersData } from '@/hooks/useOffersData';

// Components
import AddLoanBanner from '@/components/offers/AddLoanBanner';
import FilterChips from '@/components/offers/FilterChips';
import PersonalizedRecommendations from '@/components/offers/PersonalizedRecommendations';
import LoanSelection from '@/components/offers/LoanSelection';
import ConsolidationOffers from '@/components/offers/ConsolidationOffers';
import OfferList from '@/components/offers/OfferList';

export default function OffersScreen() {
    const { theme } = useTheme();

    const {
        selectedOffer,
        setSelectedOffer,
        userLoans,
        recommendations,
        loading,
        refreshing,
        setRefreshing,
        activeFilters,
        selectedLoanIds,
        consolidationOffers,
        filteredProducts,
        toggleLoanSelection,
        selectAllLoans,
        toggleFilter,
        loadAll,
    } = useOffersData();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadAll();
    }, [loadAll, setRefreshing]);

    // Find overall best rate among filtered products
    const bestRate = React.useMemo(() => {
        if (filteredProducts.length === 0) return null;
        return Math.min(
            ...filteredProducts
                .map((p) => p.interest_rate_min)
                .filter((r): r is number => r !== null)
        );
    }, [filteredProducts]);

    const bestProduct = React.useMemo(() => {
        if (bestRate === null) return undefined;
        return filteredProducts.find((p) => p.interest_rate_min === bestRate);
    }, [filteredProducts, bestRate]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.bg }]}>
                <View>
                    <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                        Marketplace
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        Best Offers
                    </Text>
                </View>
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
                {/* Search / Filters */}
                <FilterChips activeFilters={activeFilters} toggleFilter={toggleFilter} />

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

                        {/* Recommendation engine results */}
                        <PersonalizedRecommendations recommendations={recommendations} />

                        {/* Consolidation Section */}
                        <LoanSelection
                            userLoans={userLoans}
                            selectedLoanIds={selectedLoanIds}
                            toggleLoanSelection={toggleLoanSelection}
                            selectAllLoans={selectAllLoans}
                        />
                        <ConsolidationOffers consolidationOffers={consolidationOffers} />

                        {/* General Market Offers */}
                        <OfferList
                            filteredProducts={filteredProducts}
                            activeFilters={activeFilters}
                            bestRate={bestRate}
                            bestProduct={bestProduct}
                            selectedOffer={selectedOffer}
                            setSelectedOffer={setSelectedOffer}
                        />
                    </>
                )}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
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
        paddingBottom: 100, // Space for tab bar
    },
    loadingContainer: {
        paddingTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        fontWeight: '500',
    },
});
