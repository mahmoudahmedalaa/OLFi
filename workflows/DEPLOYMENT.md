# Deployment Procedures

> Build, deploy, and rollback. No surprises.

## Environments

| Environment | Purpose | Branch | URL |
|:------------|:--------|:-------|:----|
| **Development** | Local coding | feature/* | localhost |
| **Staging** | Testing before release | develop | staging URL |
| **Production** | Live users | main | production URL |

---

## Mobile App Deployment (Local Xcode)

> **Always use local Xcode builds.** Never use EAS Build or other paid cloud build services. See `XCODE_GUIDE.md` for full details.

### Quick Test on Your Phone (Debug)
```bash
# Plug iPhone in via USB
open ios/YourApp.xcworkspace
# In Xcode: Select your iPhone → Press Cmd+R
```

### Production Build (TestFlight / App Store)
```bash
# One command — builds, signs, exports IPA
./build-ios.sh
```

### Upload to TestFlight
```
Xcode → Window → Organizer → Select archive → Distribute App
→ App Store Connect → Upload
```

### ⚠️ App Store Connect Configuration (BEFORE Submitting)
> See `../05-checklists/APP_STORE.md` for the full detailed checklist.

Before submitting any build for App Store Review, you MUST complete these in App Store Connect:

1. **Create Subscription Group**: MONETIZATION → Subscriptions → "+" → Create group
2. **Create Subscriptions**: Inside group → "+" → Add each subscription with pricing, localization, review screenshot + notes
3. **Create Group Localization**: Bottom of group page → Localization → Create (display name + app name)
4. **Set Legal URLs**: General → App Information → Privacy Policy URL + License Agreement (switch to Custom EULA)
5. **Add Subscription Info to Description**: Include pricing, renewal terms, and legal URLs at bottom of description
6. **Attach Subscriptions to Version**: In your version page, scroll to "In-App Purchases and Subscriptions" → attach all products
7. **Sign Paid Applications Agreement**: Agreements, Tax, and Banking → complete all forms

### Submit to App Store
```
App Store Connect → Your App → Add Build → Attach IAPs → Submit for Review
```

### Over-the-Air Updates (JS only)
```bash
# For JS-only changes (no native module additions)
eas update --branch production --message "Bug fix: [description]"
```

> ⚠️ OTA updates only work for JavaScript changes. Native module additions require a full build via `./build-ios.sh`.

---

## Web App Deployment

### Vercel (Recommended)
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manual Build
```bash
npm run build
npm run start  # Verify locally before deploying
```

---

## Pre-Deployment Checklist

Before ANY production deployment:

### Code & Build
- [ ] All tests pass
- [ ] `tsc --noEmit` has no errors
- [ ] No `console.log` statements (use `__DEV__` guards)
- [ ] Production environment variables set
- [ ] Debug tools stripped (see `PRODUCTION_HARDENING.md`)
- [ ] Staging tested end-to-end
- [ ] Build number incremented in `Info.plist`
- [ ] Git tag created for the version

### App Store Connect (if submitting to App Store)
- [ ] IAP products created with screenshots + review notes (status: "Ready to Submit")
- [ ] IAP products attached to the app version
- [ ] Privacy Policy URL set in App Information
- [ ] EULA / Terms of Use URL set in App Information OR in description
- [ ] App Description includes subscription disclosure (pricing, renewal, management)
- [ ] Paid Applications Agreement signed (if first submission with IAP)

---

## Rollback Plan

### Mobile
1. If caught before review: cancel in App Store Connect
2. If live: submit a hotfix build immediately
3. For JS issues: push OTA update reverting the change

### Web
1. Revert to previous deployment in Vercel/hosting dashboard
2. Or: `git revert HEAD && git push` → auto-deploys previous version

### Database
1. Never run destructive migrations without a backup
2. Keep migration rollback scripts
3. Test rollbacks on staging first

---

## Post-Deploy Monitoring

After every production deployment, monitor for 24 hours:

- [ ] Error tracking dashboard (Sentry, Crashlytics)
- [ ] App Store crash reports
- [ ] User feedback channels
- [ ] Server/function logs
- [ ] Performance metrics (load times, API latency)
