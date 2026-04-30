# App Store Connect & TestFlight Runbook

This guide covers the exact steps required to push a new build of the OLFi app from a developer's machine up to Apple's TestFlight for internal QA, and eventually to the App Store.

## Prerequisites
1.  **Apple Developer Account:** You must be added to the team on Apple Developer Portal with the "App Manager" or "Admin" role.
2.  **Expo.dev Account:** Ensure you are logged into EAS CLI (`eas login`).

## Step 1: Incrementing Versions
Before creating a release candidate (RC), you MUST bump the version numbers in two places:
*   `app.json`: Bump the `version` (e.g., `1.0.5` -> `1.0.6`) for major/minor updates. Always bump the `ios.buildNumber` (e.g., `42` -> `43`) for every single new archive, even if it's just a hotfix.

## Step 2: EAS Build (Expo Application Services)
We use EAS to handle the heavy lifting of signing and archiving the iOS `.ipa` file.

1.  Run the standard production build command:
    ```bash
    eas build --platform ios --profile production
    ```
2.  If this is your first time building on a new machine, EAS will ask you to log into your Apple account to auto-manage provisioning profiles and distribution certificates. Say **Yes**.
3.  Wait for the build to finish (typically 15-25 minutes).

## Step 3: Submitting to TestFlight
Once the EAS build finishes successfully, you can submit the compiled binary directly to App Store Connect.

1.  Run the submit command:
    ```bash
    eas submit -p ios --latest
    ```
2.  This command uploads the `.ipa` to Apple.
3.  Log into **App Store Connect** -> OLFi App -> TestFlight.
4.  The build will say "Processing" (can take up to 30 mins).
5.  Once processed, provide Export Compliance documentation (usually "No" for standard encryption), and the build will be pushed to internal testers automatically.

## Step 4: App Store Release
1.  In App Store Connect, go to the App Store tab.
2.  Create a new version (e.g., `1.0.6`).
3.  Select the build you just pushed to TestFlight.
4.  Update the "What's New in this Version" release notes.
5.  Click **Submit for Review**. Apple review typically takes 24-48 hours.
