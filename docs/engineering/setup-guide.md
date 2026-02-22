# BuyOut Developer Setup Guide (Zero-to-Hero)

Welcome to the BuyOut engineering team! This guide will walk you through setting up your local environment from scratch so you can build, run, and contribute to the iOS mobile application.

## Prerequisites

Before cloning the repository, ensure your macOS system has the following core dependencies installed:

1.  **Homebrew:** The missing package manager for macOS.
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
2.  **Node.js (v20+):** We recommend using `nvm` (Node Version Manager).
    ```bash
    brew install nvm
    nvm install 20
    nvm use 20
    nvm alias default 20
    ```
3.  **Watchman:** Required by React Native for watching file changes.
    ```bash
    brew install watchman
    ```
4.  **Ruby (v3.2+):** Apple's system Ruby is deprecated. Use `rbenv` or `rvm`.
    ```bash
    brew install rbenv ruby-build
    rbenv install 3.2.2
    rbenv global 3.2.2
    ```
5.  **CocoaPods:** Dependency manager for Swift and Objective-C Cocoa projects.
    ```bash
    sudo gem install cocoapods
    ```
6.  **Supabase CLI:** Required for local database development and running Edge Functions.
    ```bash
    brew install supabase/tap/supabase
    ```
7.  **Xcode:** Download the latest version from the Mac App Store. Install the iOS Simulator components when prompted.

---

## 1. Clone the Repository & Install Dependencies

```bash
git clone <repository-url>
cd BuyOut/app
npm install
```

## 2. Environment Variables (`.env`)

You need to set up your environment variables to connect to our BaaS (Supabase). Ask the lead engineer for access to the staging or production Supabase dashboard.

Create a `.env` file in the root of the `/app` directory:

```env
# /app/.env
EXPO_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## 3. iOS Native Setup (Pod Install)

Because we use Expo in bare/custom workflow mode (to support complex native modules like `@react-native-community/slider`), you must install the iOS pods before running the app.

```bash
cd ios
pod install
cd ..
```

*Note: If you ever add a new library that requires native code, run `npx expo prebuild --clean` to regenerate the `ios` and `android` folders, then run `pod install` again.*

## 4. Running the App

Start the Expo development server and boot the iOS simulator.

```bash
npx expo run:ios
```

This command will:
1. Compile the native iOS application using Xcode tools.
2. Launch the iPhone simulator.
3. Start the Metro bundler.
4. Load the app bundle onto the simulator.

---

## 5. Local Supabase Development (Optional but Recommended)

If you need to test database migrations or run Edge Functions locally without hitting the staging database, you can use the Supabase CLI.

Navigate to the project root (where the `supabase` directory is located) and start the local instance:

```bash
cd .. # Go back to the root BuyOut directory from /app
supabase start
```

This spins up an entire Supabase stack in Docker (PostgreSQL, GoTrue for Auth, PostgREST for APIs, Storage, and Edge Functions).

**To test Edge Functions locally:**
```bash
supabase functions serve <function-name> --no-verify-jwt
```

## Troubleshooting Common Setup Issues

*   **Error: `pod install` fails with architecture mismatch (M1/M2/M3 Macs):**
    Ensure your terminal is not running in Rosetta mode, and that you installed Ruby via `rbenv` globally, not relying on the macOS default.
*   **Error: `Metro bundler fails to start due to EMFILE`:**
    This means Watchman hit its file limit. Run `brew reinstall watchman` and restart the terminal.
*   **Module not found after adding a new package:**
    Sometimes the Metro cache gets stuck. Run `npm start -- -c` to clear the cache.
