<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
//////////////////////
 2. Then run these commands:

  cd C:\dev2025\pilow\PillPathApp
  npm install
  npx expo start

  3. View the app:

  - On Phone: Download "Expo Go" app from App Store/Play Store, scan the QR code
  - On Android Emulator: Press a in terminal
  - On iOS Simulator (Mac only): Press i in terminal
  - On Web Browser: Press w in terminal

  ---
 Start Android Emulator

  Open Android Studio, then:
  - Go to Tools > Device Manager
  - Click the Play button ▶ next to an emulator to start it

  Or from terminal:
  # List available emulators
  emulator -list-avds

  # Start one (replace with your emulator name)
  emulator -avd Pixel_7_API_34

  2. Run the App

  cd C:\dev2025\pillbow\pillbowApp

  npm install

  npx expo start -a

  The -a flag automatically opens on Android emulator.

  No Emulator Yet?

  Create one in Android Studio:
  1. Tools > Device Manager
  2. Click Create Device
  3. Select Pixel 7 (or any phone)
  4. Select API 34 (Android 14)
  5. Click Finish
  6. Click Play ▶ to start it

  Once emulator is running, run npx expo start -a and the app will appear!
