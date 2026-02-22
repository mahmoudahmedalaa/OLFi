# BuyOut Security Audit & Deployment Checklist

Before any major release to the Apple App Store, the Lead Engineer must perform this security audit to guarantee no vulnerabilities are exposed.

## 1. Environment Variables & Secrets
- [ ] No `.env` files are checked into the Git repository.
- [ ] No hardcoded API keys exist in the `app/` codebase.
- [ ] Supabase `anon_key` is the only key allowed on the client. The `service_role_key` MUST NEVER leave edge functions or the admin environment.

## 2. Supabase Infrastructure Check
- [ ] **RLS Verification:** Run a manual query test simulating an anonymous user attempting to `SELECT * FROM user_debts`. It must return 0 rows.
- [ ] **Edge Functions Auth:** Verify all deployed Edge Functions have `verify_jwt: true` explicitly set.
- [ ] **Auth Settings:** Ensure "Enable Email Confirmations" is toggled ON to prevent spam account creation.

## 3. Client-Side Security (React Native)
- [ ] **JWT Storage:** Tokens are stored using `@react-native-async-storage/async-storage` and not susceptible to cross-site scripting (as Web is).
- [ ] **Biometrics:** For high-stakes actions (e.g., submitting the final loan application), `expo-local-authentication` (FaceID/TouchID) should be triggered to guarantee the device owner is present.
- [ ] **Jailbreak Detection:** (Future item) Integrate root/jailbreak detection to prevent memory hooking of the calculation engine.

## 4. PII Logging Prevention
- [ ] **Console Logs:** Ensure all `console.log()` statements containing PII (names, salaries, debts) are stripped during the production build step.
- [ ] **Crashlytics:** Verify that Sentry/CrashAnalytics does not accidentally capture the user's `store` state containing financial data during a crash dump. Send only anonymized IDs.
