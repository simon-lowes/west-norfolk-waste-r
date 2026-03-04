# West Norfolk Waste-R

## AUTONOMOUS EXECUTION RULES
When running unattended: Never ask questions, never present options, make all decisions yourself, proceed immediately.

## Project Overview
**West Norfolk Waste-R** - A React Native (Expo) app for West Norfolk residents to check bin collection schedules, search what goes where, find recycling centres, and view service alerts. Supports iOS, Android, and web.

## Tech Stack
- **Framework**: Expo SDK 54 (React Native 0.81)
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
