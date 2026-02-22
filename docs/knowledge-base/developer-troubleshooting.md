# BuyOut Developer Troubleshooting Guide

This document catalogs common errors encountered when developing the BuyOut mobile application and their confirmed resolutions.

## 1. Expo & Metro Bundler Errors

**Error:** `ENOSPC: System limit for number of file watchers reached`
*   **Cause:** Your system's file watcher limit (specifically `watchman` or `inotify`) is too low for the size of `node_modules`.
*   **Fix (macOS):** `brew reinstall watchman`, then restart your terminal.

**Error:** `React Native Version Mismatch` or `Native module cannot be null`
*   **Cause:** You installed a new library that requires native code (e.g., `@react-native-community/slider`) but didn't rebuild the iOS app.
*   **Fix:** Run `npx expo prebuild --clean` followed by `cd ios && pod install && cd ..` and finally `npx expo run:ios`.

**Error:** `Unrecognized font family 'Inter-Bold'`
*   **Cause:** Custom fonts were not linked correctly, or the app was reloaded without rebuilding the native binary after adding a font.
*   **Fix:** Ensure your `expo-font` configuration in `layout.tsx` is loading the font asynchronously before the splash screen hides. If the font file is newly added to `/assets/fonts`, you must rebuild (`npx expo run:ios`).

## 2. Supabase & Backend Errors

**Error:** `AuthApiError: Invalid login credentials` (even when correct)
*   **Cause:** Often happens in local development if pointing to a staging database where the user was wiped by a script, but the client still holds a stale parsed JWT.
*   **Fix:** Manually clear AsyncStorage via React Native Debugger or completely delete and reinstall the app on the simulator.

**Error:** `PGRST301: JWT expired`
*   **Cause:** The user's Supabase session expired while the app was in the background, and the automatic token refresh failed due to network connectivity.
*   **Fix:** The `supabase.auth.onAuthStateChange` listener should catch this and dispatch a sign-out event, dropping the user back to the `(auth)` stack. If it gets stuck, implement a global Axios/Fetch interceptor that watches for 401s and forces a logout.

**Error:** `Edge Function returns 500 without logs`
*   **Cause:** You likely deployed an Edge Function with a runtime error (e.g., trying to read `Deno.env.get` for a variable that isn't deployed).
*   **Fix:** 
    1. Test locally: `supabase functions serve <name>`
    2. Check production logs: Navigate to the Supabase Dashboard -> Edge Functions -> Logs.

## 3. Native UI / Gluestack Quirks

**Issue:** `ScrollView` content is hidden behind the bottom tab bar.
*   **Fix:** Do not manually add massive padding. Always wrap the main content in `<SafeAreaView>` from `react-native-safe-area-context` and set `edges={['top']}` if you want it to flow under the transparent tab bar, adding specific bottom padding based on the tab bar's height.
