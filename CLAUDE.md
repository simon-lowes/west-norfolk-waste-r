# West Norfolk Waste-R

## AUTONOMOUS EXECUTION RULES
When running unattended: Never ask questions, never present options, make all decisions yourself, proceed immediately.

## Project Overview
**West Norfolk Waste-R** - A React Native (Expo) app for West Norfolk residents to check bin collection schedules, search what goes where, find recycling centres, and view service alerts. Supports iOS, Android, and web.

## Tech Stack
- **Framework**: Expo SDK 58 (React Native 0.88, React 19.3); Expo tooling needs Node 22.13+ (CI uses Node 22)
- **Language**: TypeScript
- **Navigation**: React Navigation (bottom tabs + native stack)
- **Styling**: Custom theme system (light/dark mode)
- **Icons**: lucide-react-native
- **Font**: Nunito 700 Bold (via @expo-google-fonts)
- **Testing**: Jest + @testing-library/react-native

## Key Commands
```bash
npm run start      # Start Expo dev server
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
npm run web        # Start web version
npm run build      # Export for web (expo export --platform web)
npm run test       # Run unit tests (jest)
npm run test:watch # Run tests in watch mode
npm run lint       # ESLint check (src/)
```

## Project Structure
```
App.tsx                    # Root component: navigation, providers, tab bar
index.ts                   # Entry point
app.json                   # Expo config
src/
  api/
    bankHolidays.ts        # GOV.UK bank holidays API (cached 24h)
    weatherWarnings.ts     # Met Office weather warnings API
    types.ts               # API type definitions and cache helpers
    index.ts               # API exports
  components/
    AlertCard.tsx           # Service alert display
    BinBadge.tsx            # Bin type badge
    Button.tsx              # Shared button component
    Card.tsx                # Base card component
    CollectionCard.tsx      # Bin collection info card
    EmptyState.tsx          # Empty state placeholder
    HeroCollectionCard.tsx  # Featured collection card
    LocationPicker.tsx      # Address/location picker
    PhotoPicker.tsx         # Photo picker for reports
    SearchInput.tsx         # Search input field
    ThemeToggle.tsx         # Light/dark mode toggle
  context/
    DevModeContext.tsx      # Demo/real data mode toggle (persisted via AsyncStorage)
  data/
    mockAlerts.ts           # Mock service alerts
    mockProperties.ts       # Mock property data
    mockRecyclingCentres.ts # Mock recycling centre data
    mockWasteItems.ts       # Mock waste item data
  hooks/
    useAlerts.ts            # Service alerts hook
    useBankHolidays.ts      # Bank holidays data hook
    useCollections.ts       # Bin collection schedule hook
    useDevMode.ts           # Dev mode toggle hook
    useDismissedAlerts.ts   # Dismissed alerts tracking
    useLocation.ts          # Location/address hook
    useNotifications.ts     # Push notification hook
    useProperty.ts          # Property details hook
    useWasteSearch.ts       # Waste item search hook
    useWeatherWarnings.ts   # Weather warnings hook
  screens/
    HomeScreen.tsx          # Dashboard with next collection, alerts
    FindBinDayScreen.tsx    # Collection schedule calendar
    WhatGoesWhereScreen.tsx # Waste item search
    RecyclingCentresScreen.tsx # Nearby recycling centres
    MoreScreen.tsx          # More menu (settings, alerts, report)
    ServiceAlertsScreen.tsx # Service alerts list
    ReportIssueScreen.tsx   # Report missed collection
    SettingsScreen.tsx      # App settings
  theme/
    colors.ts               # Color palette (light/dark)
    spacing.ts              # Spacing scale
    typography.ts           # Typography styles
    ThemeContext.tsx         # Theme provider and hooks
  types/
    property.ts             # Property type definitions
    recyclingCentre.ts      # Recycling centre types
    report.ts               # Issue report types
    serviceAlert.ts         # Service alert types
    wasteItem.ts            # Waste item types
  utils/
    animations.ts           # Animation helpers
    dateUtils.ts            # Date formatting utilities
    distanceUtils.ts        # Distance calculations
    searchUtils.ts          # Search/filter utilities
```

## Architecture
- **DevModeContext**: Toggles between `demo` and `real` data modes, persisted in AsyncStorage. In demo mode, hooks return mock data from `src/data/`.
- **API layer** (`src/api/`): Bank holidays from GOV.UK (free, no auth), weather warnings from Met Office. Both cached locally with 24h TTL.
- **Navigation**: Bottom tab bar (Home, Schedule, Search, Centres, More) with a stack navigator inside More for settings/alerts/report screens.
- **Theme**: Custom ThemeProvider with light/dark support, controlled by ThemeToggle.

## Design Notes
- Nunito 700 Bold used for headings (loaded via expo-font)
- Icons from lucide-react-native (consistent stroke width 2)
- Portrait orientation only

## Native Builds (Expo SDK 58)
The app moved from SDK 57 to SDK 58 on 20 Oct 2026 (#294). Nothing in `ios/` or `android/` is committed: native projects are generated by prebuild, so after any SDK upgrade regenerate them rather than patching by hand.

- **Regenerate native projects**: `npx expo prebuild --clean`, then `npx expo-doctor`. Do not reuse `ios/` or `android/` folders generated under SDK 57.
- **iOS scene-based life cycle**: the iOS 27 SDK requires UIScene. SDK 58's prebuild generates `SceneDelegate.swift` and a `UIApplicationSceneManifest` entry in `Info.plist`; the window is created by the scene delegate, not in `didFinishLaunchingWithOptions`. Any app-delegate customisation must go through `ExpoAppDelegate` subscribers or a config plugin, never a hand-edited delegate.
- **Android R8**: release builds now minify and obfuscate by default (`android.enableMinifyInReleaseBuilds=true` in the generated `gradle.properties`, `proguard-android-optimize.txt` preset). Libraries that rely on reflection may need ProGuard keep rules. To opt out, set `enableMinifyInReleaseBuilds: false` via the `expo-build-properties` plugin in `app.json`; do not edit the generated Gradle files.
- **Android Gradle Plugin**: SDK 58 tooling supports AGP 9.
- **Node**: Expo tooling requires Node 22.13+ (or 24.3+); odd-numbered releases (23, 25) are unsupported. CI runs Node 22 and `package.json` records `engines.node >= 22.13.0`.
- **Expo Go**: the SDK 58 Expo Go app only supports SDK 58. Until it is in the stores, use a development build (`npx expo run:ios` / `run:android` after prebuild) rather than Expo Go.
- **Already handled in code**: `newArchEnabled` is true in `app.json`; the `expo-notifications` handler in `App.tsx` returns `shouldShowBanner` / `shouldShowList`, so SDK 58's "show foreground notifications by default" change has no effect; none of the removed React Native 0.87/0.88 APIs (`InteractionManager`, `Touchable`, `StatusBar` `backgroundColor`/`translucent`, `Modal` `animated`, deep `react-native/Libraries` imports) are used; `tsc --noEmit` is clean under the React Native strict TypeScript API.
- **Testing**: jest-expo 58 pairs with jest 30 (`jest ~30.5`, `@types/jest ^30`). Keep them together when either moves.

## CI and Dependabot
- `ci.yml` runs Test (jest, eslint) and Build (`expo install --check`, web export) on every PR; both are required checks on `main`.
- `dependabot-auto-merge.yml` approves and enables auto-merge for non-major Dependabot bumps once those checks pass.
- Expo SDK packages must be bumped together: `expo install --check` fails the Build job as soon as any one of them lags. Dependabot's one-package-at-a-time PRs cannot satisfy it on their own (see #249, #263).
- A Claude-based `claude-review` job used to run in the auto-merge workflow. It was removed in September 2026 after failing on every PR since July (expired `CLAUDE_CODE_OAUTH_TOKEN`, plus upstream bugs) with nothing depending on it. The `CLAUDE_CODE_OAUTH_TOKEN` secret can be deleted. To bring it back, see https://code.claude.com/docs/en/github-actions.
