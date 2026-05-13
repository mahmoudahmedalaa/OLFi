/**
 * Analytics Tracker
 * 
 * Lightweight event tracking that stores events in Supabase.
 * All calls are fire-and-forget - never blocks UI.
 */
import { supabase } from './supabase';
import { Platform } from 'react-native';

let _userId: string | null = null;
let _sessionId: string | null = null;

/** Initialize analytics with user ID */
export function initAnalytics(userId: string) {
    _userId = userId;
    _sessionId = `${userId.slice(0, 8)}-${Date.now()}`;
}

/** Clear analytics on sign out */
export function clearAnalytics() {
    _userId = null;
    _sessionId = null;
}

/**
 * Track an event. Fire-and-forget.
 * @param eventName - Name of the event (e.g. 'screen_view', 'offer_applied')
 * @param eventData - Optional payload
 * @param screen - Optional screen name
 */
export function trackEvent(
    eventName: string,
    eventData?: Record<string, unknown>,
    screen?: string
) {
    if (!_userId) return;

    // Fire and forget - don't await
    (async () => {
        try {
            await supabase
                .from('analytics_events')
                .insert({
                    user_id: _userId,
                    event_name: eventName,
                    event_data: {
                        ...eventData,
                        platform: Platform.OS,
                    },
                    screen,
                    session_id: _sessionId,
                });
        } catch {
            // Silent fail - analytics should never block UX
        }
    })();
}

/** Track a screen view */
export function trackScreen(screenName: string) {
    trackEvent('screen_view', { screen_name: screenName }, screenName);
}

// ─── Predefined Event Helpers ──────────────────────────────

/** Track when a loan is added */
export function trackLoanAdded(loanType: string, amount: number) {
    trackEvent('loan_added', { loan_type: loanType, amount });
}

/** Track when a loan is deleted */
export function trackLoanDeleted(loanId: string) {
    trackEvent('loan_deleted', { loan_id: loanId });
}

/** Track when an offer is viewed */
export function trackOfferViewed(productId: string, bankName: string) {
    trackEvent('offer_viewed', { product_id: productId, bank_name: bankName }, 'offer_details');
}

/** Track when an application is started */
export function trackApplicationStarted(productId: string) {
    trackEvent('offer_apply_started', { product_id: productId }, 'apply_offer');
}

/** Track when an application is submitted */
export function trackApplicationSubmitted(productId: string, monthlySavings: number) {
    trackEvent('offer_applied', { product_id: productId, monthly_savings: monthlySavings }, 'apply_offer');
}

/** Track calculator usage */
export function trackCalculatorUsed(calculatorType: string) {
    trackEvent('calculator_used', { calculator_type: calculatorType }, 'calculator');
}

/** Track profile updates */
export function trackProfileUpdated(fields: string[]) {
    trackEvent('profile_updated', { fields });
}

/** Track coming soon notification opt-in */
export function trackComingSoonNotify(feature: string) {
    trackEvent('coming_soon_notify', { feature });
}

/** Track sign up */
export function trackSignUp() {
    trackEvent('sign_up', {});
}

/** Track sign in */
export function trackSignIn() {
    trackEvent('sign_in', {});
}
