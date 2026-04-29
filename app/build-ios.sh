#!/bin/bash

echo "🚀 Preparing OLFi for Simulator and TestFlight Archive..."
echo "--------------------------------------------------------"

# Ensure we are in the correct directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from inside the 'app' directory, where app.json is located."
    exit 1
fi

echo "🧹 Cleaning previous builds..."
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/OLFi-*

echo "📦 Regenerating native code..."
npx expo prebuild --clean

echo "--------------------------------------------------------"
echo "What would you like to build?"
echo "1) Simulator Build (Development)"
echo "2) TestFlight Archive (Production / IPA)"
echo "--------------------------------------------------------"
read -p "Select an option (1 or 2): " option

if [ "$option" == "1" ]; then
    echo "🔨 Building for iOS Simulator..."
    # npx expo run:ios handles both building and immediately installing on the open simulator
    npx expo run:ios
elif [ "$option" == "2" ]; then
    echo "🔨 Building Production Archive for TestFlight (Local EAS)..."
    # This requires EAS CLI installed (`npm install -g eas-cli`)
    eas build --platform ios --profile production --local
    
    echo "✅ Archive completed! You can use Apple Transporter (Mac App Store) to drag and drop the resulting .ipa file."
else
    echo "❌ Invalid option."
fi
