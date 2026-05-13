/**
 * Haptic Feedback Utility
 * 
 * Lightweight wrapper around expo-haptics for consistent feedback across the app.
 * All haptics are fire-and-forget - errors are silently caught (not all devices support them).
 */
import * as Haptics from 'expo-haptics';

/** Light tap - used for button presses, toggles, selections */
export const hapticLight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
};

/** Medium tap - used for confirmations, form submissions */
export const hapticMedium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
};

/** Heavy tap - used for destructive actions, important confirmations */
export const hapticHeavy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => { });
};

/** Success - used after successful operations */
export const hapticSuccess = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
};

/** Warning - used for alerts, approaching limits */
export const hapticWarning = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => { });
};

/** Error - used for failed operations */
export const hapticError = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => { });
};

/** Selection changed - used for scroll pickers, tab switches */
export const hapticSelection = () => {
    Haptics.selectionAsync().catch(() => { });
};
