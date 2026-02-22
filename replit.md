# replit.md

## Overview

"What's That? Early Words" is a cross-platform mobile app built with Expo/React Native and TypeScript, designed to help toddlers (ages 1–3) learn early vocabulary. Children tap on images to hear words spoken aloud via text-to-speech. The app uses a freemium model: free users get the first page of each category and limited custom categories, while premium users unlock all pages and unlimited custom content. The app includes a parent lock (math question gate), kiosk mode, and a settings screen. A backend Express server exists but is minimally used — most app state is stored locally via AsyncStorage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)

- **Framework**: Expo SDK 54 with expo-router for file-based navigation (Stack navigator)
- **Language**: TypeScript with strict mode
- **Orientation**: Landscape-only mode locked via app.json. All screens designed for landscape layout.
- **UI**: Custom components with toddler-friendly design — large tap targets, bright colors, Nunito font family
- **State Management**: React Context (`AppProvider` in `lib/app-context.tsx`) with AsyncStorage for persistence. No Redux or other state library.
- **Navigation**: File-based routing via expo-router. Welcome screen (`index`) leads to learning carousel (`learn`). Routes include: welcome (`index`), carousel (`learn`), `category/[id]` (parent direct access), `custom-category/[id]`, `settings` (parent-only via unlock), `upgrade`, `custom-categories`, `add-custom`, `info`
- **Animations**: react-native-reanimated for bounce/spring animations on card taps
- **Audio**: expo-speech for text-to-speech with selectable voice styles (female/male) via `lib/voice.ts`. Voice parameters (pitch, rate) tuned per style for offline playback.
- **Haptics**: expo-haptics for tactile feedback on interactions
- **Data**: Categories and items are seeded in `lib/categories-seed.ts` as static data. Custom categories are stored in AsyncStorage.
- **Fonts**: Nunito (400, 600, 700, 800 weights) via @expo-google-fonts/nunito

### Backend (Express)

- **Framework**: Express 5 with TypeScript
- **Purpose**: Minimal — serves a landing page and provides API scaffolding. Currently has no meaningful API routes.
- **Storage**: In-memory storage (`MemStorage` class in `server/storage.ts`) with a basic User model. Not actively used by the mobile app.
- **Database Schema**: Drizzle ORM with PostgreSQL configured (`shared/schema.ts`), but only has a `users` table. The app doesn't actively use the database — it's scaffolding for future use.
- **CORS**: Configured for Replit dev/deployment domains and localhost

### Data Model

- **Categories**: Hardcoded seed data with id, name, icon, color, pages (each containing 6 items)
- **Items**: Have label, icon (MaterialCommunityIcons name), color. Tapping speaks the label.
- **Custom Categories**: User-created, stored locally in AsyncStorage, limited to 3 for free users
- **User Settings**: `kioskModeEnabled`, `premiumUnlocked`, `soundEnabled`, `voiceStyle` ('female' | 'male'), `kioskCategoryId`, `language` (LanguageCode), `voiceLanguage` (LanguageCode), `disabledCategories` (string[]) — all persisted in AsyncStorage
- **Premium/Free Model**: First page of each category is free. Additional pages require `premiumUnlocked`. Custom categories capped at 3 for free users. English is free; 14 other languages require premium. Premium users can show/hide categories and see custom categories in the carousel.
- **Multi-Language Support**: 15 languages (English, Spanish, Mandarin Chinese, Hindi, Arabic, French, Portuguese, Bengali, Russian, Japanese, German, Korean, Italian, Turkish, Vietnamese). Separate settings for text display language (`language`) and spoken word language (`voiceLanguage`). Translation files in `assets/languages/*.json` contain UI strings, category names, and item labels. Translation system in `lib/i18n.ts` with `useTranslation` hook, `getItemLabel`, `getCategoryName` helpers. Language pickers in settings use inline expandable lists (not modals).

### Key Design Decisions

1. **Local-first architecture**: All app data lives on-device via AsyncStorage. No authentication or cloud sync is implemented yet (though the original spec mentioned Firebase).
2. **Icon-based items instead of photos**: Items use MaterialCommunityIcons rather than real images, keeping the bundle small and avoiding asset management complexity.
3. **Text-to-speech over recorded audio**: Uses expo-speech for word pronunciation, eliminating the need for audio file management.
4. **Parent lock via math questions**: Simple math questions gate access to settings, preventing toddlers from changing configuration.
5. **In-App Purchases via RevenueCat**: The upgrade flow uses `react-native-purchases` (RevenueCat SDK). On iOS/Android with a configured API key, it shows real products and processes real purchases. Falls back to demo mode (simple toggle) when no API key is set or in Expo Go/web. RevenueCat provider in `lib/purchases.tsx`, wraps the app in `_layout.tsx`. Entitlement ID is `premium`. API keys are configured via `EXPO_PUBLIC_RC_IOS_KEY` and `EXPO_PUBLIC_RC_ANDROID_KEY` env vars.
6. **Landscape-only orientation**: App is locked to landscape mode for optimal toddler interaction with larger images and labels.
7. **Kiosk mode with seamless swiping**: When enabled, all categories/pages flatten into a single horizontal swipeable experience. Hidden parent exit via long-press (2 seconds) on a shield icon. No back buttons in kiosk mode.
8. **Category screen horizontal paging**: FlatList with pagingEnabled for horizontal swiping between pages (and across categories in kiosk mode). 2x3 grid layout for items with large images and bold labels.
9. **Landscape layouts for all screens**: Settings uses 2-column layout, Upgrade uses side-by-side hero/plans, Info uses 2x2 grid of cards, Add Custom uses side-by-side name/items layout.

### Build & Development

- **Dev mode**: Two processes — `expo:dev` for the Expo bundler and `server:dev` for the Express backend
- **Production build**: Static web export via custom build script (`scripts/build.js`), Express serves the built files
- **Server build**: esbuild bundles the server to `server_dist/`
- **Database migrations**: `drizzle-kit push` for schema changes

## External Dependencies

- **PostgreSQL (Drizzle ORM)**: Configured but minimally used. Schema has only a `users` table. Will need a DATABASE_URL environment variable when actively used.
- **AsyncStorage**: Primary data persistence for app settings and custom categories
- **expo-speech**: Text-to-speech engine for word pronunciation
- **expo-haptics**: Device haptic feedback
- **@tanstack/react-query**: Configured with a query client but not heavily used yet — scaffolding for future API integration
- **expo-router**: File-based navigation
- **react-native-reanimated**: Animation library for interactive card components
- **Nunito Google Font**: App typography
- **No Firebase**: Despite the original spec mentioning Firebase, the current implementation does not use Firebase for auth, storage, or analytics
- **react-native-purchases (RevenueCat)**: In-app purchase management. Configured in `lib/purchases.tsx`. Uses `EXPO_PUBLIC_RC_IOS_KEY` / `EXPO_PUBLIC_RC_ANDROID_KEY` env vars. Falls back to demo mode without keys.
- **react-native-purchases-ui**: Pre-built RevenueCat paywall UI components (available for future use)