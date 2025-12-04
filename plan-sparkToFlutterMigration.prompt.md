# FLUTTER MIGRATION PLAN — Spark → Flutter

**West Norfolk Waste & Recycling Mobile App**  
**Complete Multi-Phase Implementation Strategy**

---

## EXECUTIVE SUMMARY

This document provides a comprehensive, step-by-step migration plan to convert the Spark (React/TypeScript) West Norfolk Waste & Recycling web application into a fully functional **Flutter mobile application** (iOS + Android).

The plan breaks the migration into **9 distinct phases**, each with:

- Clear success criteria
- Detailed implementation instructions
- Identified risks and blockers
- Dependencies and assumptions

**Total Estimated Effort**: ~4-6 weeks for a single developer (can be parallelized)  
**Flutter Target**: Flutter 3.x with Material 3 Design  
**State Management**: Riverpod v2 (chosen for its powerful async handling and clean architecture)  
**Navigation**: go_router for type-safe, deep-linkable routing

---

## TABLE OF CONTENTS

1. [Analysis of Spark Project](#1-analysis-of-spark-project)
2. [Target Flutter Architecture](#2-target-flutter-architecture)
3. [Technology Stack & Dependencies](#3-technology-stack--dependencies)
4. [Data Models Translation](#4-data-models-translation)
5. [Shared Components & Widgets](#5-shared-components--widgets)
6. [Navigation & Routing Strategy](#6-navigation--routing-strategy)
7. [Phase-by-Phase Implementation Plan](#7-phase-by-phase-implementation-plan)
8. [Risk Assessment & Mitigation](#8-risk-assessment--mitigation)
9. [Success Criteria Checklist](#9-success-criteria-checklist)

---

## 1. ANALYSIS OF SPARK PROJECT

### 1.1 Current Architecture

**Frontend Framework**: React 19 + Vite + TypeScript  
**UI Library**: Radix UI (headless components) + Tailwind CSS v4  
**State Management**: React hooks + localStorage via `@github/spark` `useKV`  
**Navigation**: In-app state-based (no URL routing)  
**Date Handling**: date-fns v3 + React Day Picker v9  
**Styling**: Tailwind CSS with oklch() color model  
**Icons**: Phosphor Icons v2 (duotone)

### 1.2 Project Structure

```
src/
├── App.tsx                    # Main app component, routing state, data persistence
├── main.tsx                   # Entry point with error boundary
├── components/
│   ├── HomeScreen.tsx         # Dashboard
│   ├── FindBinDayScreen.tsx   # Bin day lookup
│   ├── WhatGoesWhereScreen.tsx # Waste item search
│   ├── RecyclingCentresScreen.tsx
│   ├── ServiceAlertsScreen.tsx
│   ├── ReportIssueScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── AdminScreen.tsx
│   ├── AddressSelector.tsx    # Postcode lookup & selection
│   ├── CollectionCard.tsx     # Reusable collection card
│   ├── BinBadge.tsx           # Bin type indicator
│   └── ui/                    # Radix UI components
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── dates.ts              # Date utilities & bank holiday logic
│   ├── postcodes.ts          # Postcode validation
│   └── utils.ts              # General utilities
└── styles/
    └── theme.css
```

### 1.3 Data Models (TypeScript)

**Property**

```typescript
{
  id: string
  postcode: string
  address: string
  rubbishDayOfWeek: number        // 0-6
  recyclingDayOfWeek: number
  gardenDayOfWeek: number
  foodDayOfWeek: number
  nextRubbishDate?: string        // ISO
  nextRecyclingDate?: string
  nextGardenDate?: string
  nextFoodDate?: string
}
```

**WasteItem**

```typescript
{
  id: string;
  name: string;
  binType: 'general' | 'recycling' | 'garden' | 'food' | 'recycling-centre';
  notes: string;
}
```

**RecyclingCentre**

```typescript
{
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  notes: string;
}
```

**ServiceAlert**

```typescript
{
  id: string
  title: string
  message: string
  affectedPostcodes: string[]      // empty = all postcodes
  startDate: string                // ISO
  endDate: string
  severity: 'info' | 'warning' | 'urgent'
}
```

**Report**

```typescript
{
  id: string
  type: 'missed-bin' | 'fly-tipping' | 'street-lighting' | 'other'
  description: string
  location?: { latitude: number; longitude: number }
  photo?: string                   // base64
  postcode?: string
  address?: string
  createdAt: string                // ISO
  referenceNumber: string          // WN + 8-digit timestamp
}
```

### 1.4 Key Business Logic

**Date Calculations**

- Hard-coded UK bank holidays through 2025
- `getNextCollectionDate()`: Calculates next collection given day-of-week
- Adjusts forward if collection falls on bank holiday (never backward)
- `getDaysUntil()`: Countdown for UI display
- `formatDate()`: Human-readable format ("Monday 15 December")

**Address Persistence**

- Selected property saved to localStorage under `saved_property_id`
- All address-dependent screens protected by null check
- Settings screen allows address change (clears selection and shows AddressSelector)

**Service Alerts Filtering**

- Only active alerts shown (date range check)
- Filtered by user's postcode (empty affectedPostcodes = all postcodes)
- Severity levels determine UI variant (urgent = red/destructive, others = blue)

**Report Submission**

- Form validates: required type, description, photo <5MB
- Geolocation optional but encouraged
- Reference number generated as `WN${Date.now().toString().slice(-8)}`
- Confirmation screen shows reference for tracking

### 1.5 Navigation Model

State-based navigation in App.tsx:

```
currentScreen: 'home' | 'find-bin-day' | 'what-goes-where' | 'recycling-centres'
              | 'service-alerts' | 'report-issue' | 'settings' | 'admin'
```

Navigation flow:

1. **Home** ← landing screen (requires address selection)
2. **Find Bin Day** ← from nav or home
3. **What Goes Where** ← from nav or home
4. **Recycling Centres** ← from nav
5. **Service Alerts** ← from nav or home
6. **Report Issue** ← from nav
7. **Settings** ← from header button (no address required)
8. **Admin** ← from header button (no address required)

---

## 2. TARGET FLUTTER ARCHITECTURE

### 2.1 Project Structure

```
west_norfolk_waste/
├── pubspec.yaml
├── analysis_options.yaml
├── lib/
│   ├── main.dart                      # App entry point
│   ├── config/
│   │   ├── app_config.dart           # App version, URLs, constants
│   │   ├── routing/
│   │   │   └── app_router.dart       # go_router configuration
│   │   └── theme/
│   │       ├── app_theme.dart        # Material 3 theme
│   │       ├── colors.dart           # Color constants (GOV.UK palette)
│   │       └── typography.dart       # Text styles
│   ├── data/
│   │   ├── models/
│   │   │   ├── property.dart
│   │   │   ├── waste_item.dart
│   │   │   ├── recycling_centre.dart
│   │   │   ├── service_alert.dart
│   │   │   └── report.dart
│   │   ├── repositories/
│   │   │   ├── property_repository.dart
│   │   │   ├── waste_repository.dart
│   │   │   ├── alert_repository.dart
│   │   │   └── report_repository.dart
│   │   └── sample_data/
│   │       ├── mock_properties.dart
│   │       ├── mock_waste_items.dart
│   │       ├── mock_recycling_centres.dart
│   │       ├── mock_alerts.dart
│   │       └── mock_reports.dart
│   ├── domain/
│   │   ├── entities/                 # Business entities (duplicate of models for now)
│   │   └── usecases/
│   │       ├── get_next_collection_date.dart
│   │       ├── filter_alerts.dart
│   │       ├── get_bin_colour.dart
│   │       └── validate_postcode.dart
│   ├── presentation/
│   │   ├── providers/                # Riverpod providers
│   │   │   ├── property_provider.dart       # Currently selected property
│   │   │   ├── properties_provider.dart     # All properties
│   │   │   ├── waste_items_provider.dart
│   │   │   ├── alerts_provider.dart
│   │   │   ├── recycling_centres_provider.dart
│   │   │   └── reports_provider.dart
│   │   ├── screens/
│   │   │   ├── home/
│   │   │   │   ├── home_screen.dart
│   │   │   │   └── home_viewmodel.dart      # State management for home
│   │   │   ├── find_bin_day/
│   │   │   ├── what_goes_where/
│   │   │   ├── recycling_centres/
│   │   │   ├── service_alerts/
│   │   │   ├── report_issue/
│   │   │   ├── settings/
│   │   │   ├── admin/
│   │   │   └── splash/                      # Address selection screen
│   │   └── widgets/
│   │       ├── common/
│   │       │   ├── app_bar.dart
│   │       │   ├── navigation_rail.dart    # Bottom nav for mobile
│   │       │   ├── bin_badge.dart
│   │       │   ├── collection_card.dart
│   │       │   ├── service_alert_card.dart
│   │       │   ├── primary_button.dart
│   │       │   ├── secondary_button.dart
│   │       │   └── loading_skeleton.dart
│   │       └── forms/
│   │           ├── address_search_field.dart
│   │           ├── issue_type_dropdown.dart
│   │           └── postcode_input.dart
│   └── utils/
│       ├── date_utils.dart           # Port of dates.ts
│       ├── postcode_utils.dart       # Port of postcodes.ts
│       ├── color_utils.dart
│       └── constants.dart            # Bank holidays, config
├── test/
│   ├── unit/
│   │   ├── utils/
│   │   │   ├── date_utils_test.dart
│   │   │   └── postcode_utils_test.dart
│   │   └── models/
│   │       └── property_model_test.dart
│   ├── widget/
│   │   ├── home_screen_test.dart
│   │   └── app_test.dart
│   └── integration/
│       └── app_flow_test.dart
└── assets/
    └── icons/                        # App icon, launcher icons
```

### 2.2 Design System

**Color Palette** (GOV.UK-aligned, must match Spark)

| Color      | Value   | OKLCH                 | Usage                             |
| ---------- | ------- | --------------------- | --------------------------------- |
| Primary    | #1d70b8 | oklch(0.52 0.11 254)  | Primary CTAs, links, AppBar       |
| Success    | #00703c | oklch(0.45 0.13 163)  | Positive states, collection dates |
| Error      | #d4351c | oklch(0.58 0.20 32)   | Urgent alerts, errors             |
| Dark Text  | #0b0c0c | oklch(0.13 0 0)       | Body text                         |
| Dark Grey  | #505a5f | oklch(0.40 0.009 240) | Secondary text, borders           |
| Light Grey | #f3f2f1 | oklch(0.96 0.002 60)  | Backgrounds, cards                |
| White      | #ffffff | oklch(1 0 0)          | Card backgrounds                  |

**Bin Type Colors** (custom palette)

| Bin Type         | Color               | Usage                           |
| ---------------- | ------------------- | ------------------------------- |
| Rubbish          | #595959 (dark grey) | General waste                   |
| Recycling        | #3366cc (blue)      | Paper, cardboard, cans, bottles |
| Garden           | #00a651 (green)     | Garden waste                    |
| Food             | #8b6914 (brown)     | Food waste                      |
| Recycling Centre | #999999 (mid grey)  | Facility indicator              |

**Typography** (Material 3)

- **Headline Large** (32sp): Screen titles
- **Headline Medium** (28sp): Section titles
- **Title Medium** (16sp): Card titles, button text
- **Body Medium** (14sp): Main text
- **Body Small** (12sp): Helper text, timestamps
- **Label Medium** (12sp): Form labels

**Spacing Grid**: 8px base unit

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

**Touch Targets**: Minimum 48x48dp per Material 3 guidelines

### 2.3 Responsive Design

**Breakpoints**:

- Mobile: 0-599dp (phones)
- Tablet: 600-839dp (small tablets, landscape phones)
- Desktop: 840dp+ (tablets, desktop)

**Layout Strategy**:

- **Mobile**: Single-column, bottom navigation bar
- **Tablet**: Split-view with sidebar (if applicable), or optimized single column
- **Desktop**: Horizontal navigation (if desktop support needed)

For this app, focus on mobile-first (phones 320-600dp) with tablet optimization (600+dp).

---

## 3. TECHNOLOGY STACK & DEPENDENCIES

### 3.1 Core Dependencies

**pubspec.yaml entries** (to be added):

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6

  # State Management
  riverpod: ^2.4.0
  flutter_riverpod: ^2.4.0
  riverpod_generator: ^2.3.0

  # Routing
  go_router: ^13.0.0

  # Local Storage
  shared_preferences: ^2.2.2

  # Date/Time
  intl: ^0.19.0 # For locale-aware date formatting

  # HTTP (for future API integration)
  http: ^1.1.0

  # Image Handling (for photo in report)
  image_picker: ^1.0.0
  image: ^4.1.0

  # Location Services
  geolocator: ^10.1.0

  # JSON Serialization
  json_annotation: ^4.8.0

  # Accessibility
  flutter_accessibility_service: ^0.4.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  riverpod_generator: ^2.3.0
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
```

### 3.2 Why These Tools?

| Tool                   | Reason                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Riverpod**           | Powerful async state management, excellent for data fetching, easier testing than Provider |
| **go_router**          | Type-safe routing, deep linking support, matches modern Flutter patterns                   |
| **shared_preferences** | Equivalent to localStorage, simple key-value persistence                                   |
| **intl**               | Locale-aware date formatting (matches date-fns flexibility)                                |
| **image_picker**       | Camera & gallery access for report photos                                                  |
| **geolocator**         | Geolocation for report submission                                                          |
| **json_serializable**  | Code generation for model serialization                                                    |

### 3.3 Version Constraints

- **Flutter**: 3.16.0 or higher (Material 3 stable)
- **Dart**: 3.2.0 or higher
- **Minimum iOS**: 12.0
- **Minimum Android**: 8.0 (API 26)

---

## 4. DATA MODELS TRANSLATION

### 4.1 Dart Model Templates

All models will use:

- `@immutable` from `package:flutter`
- Named constructors with `const`
- `copyWith()` method for immutability patterns
- `fromJson()` / `toJson()` via `json_serializable`
- `toString()`, `==`, `hashCode` via `Equatable` (optional but recommended)

### 4.2 Model Definitions

**Property.dart**

```dart
import 'package:json_annotation/json_annotation.dart';
import 'package:flutter/foundation.dart';

part 'property.g.dart';

@immutable
@JsonSerializable()
class Property {
  const Property({
    required this.id,
    required this.postcode,
    required this.address,
    required this.rubbishDayOfWeek,
    required this.recyclingDayOfWeek,
    required this.gardenDayOfWeek,
    required this.foodDayOfWeek,
    this.nextRubbishDate,
    this.nextRecyclingDate,
    this.nextGardenDate,
    this.nextFoodDate,
  });

  final String id;
  final String postcode;
  final String address;
  final int rubbishDayOfWeek;    // 0-6 (Sunday-Saturday)
  final int recyclingDayOfWeek;
  final int gardenDayOfWeek;
  final int foodDayOfWeek;
  final String? nextRubbishDate;
  final String? nextRecyclingDate;
  final String? nextGardenDate;
  final String? nextFoodDate;

  Property copyWith({
    String? id,
    String? postcode,
    String? address,
    int? rubbishDayOfWeek,
    int? recyclingDayOfWeek,
    int? gardenDayOfWeek,
    int? foodDayOfWeek,
    String? nextRubbishDate,
    String? nextRecyclingDate,
    String? nextGardenDate,
    String? nextFoodDate,
  }) {
    return Property(
      id: id ?? this.id,
      postcode: postcode ?? this.postcode,
      address: address ?? this.address,
      rubbishDayOfWeek: rubbishDayOfWeek ?? this.rubbishDayOfWeek,
      recyclingDayOfWeek: recyclingDayOfWeek ?? this.recyclingDayOfWeek,
      gardenDayOfWeek: gardenDayOfWeek ?? this.gardenDayOfWeek,
      foodDayOfWeek: foodDayOfWeek ?? this.foodDayOfWeek,
      nextRubbishDate: nextRubbishDate ?? this.nextRubbishDate,
      nextRecyclingDate: nextRecyclingDate ?? this.nextRecyclingDate,
      nextGardenDate: nextGardenDate ?? this.nextGardenDate,
      nextFoodDate: nextFoodDate ?? this.nextFoodDate,
    );
  }

  factory Property.fromJson(Map<String, dynamic> json) =>
      _$PropertyFromJson(json);
  Map<String, dynamic> toJson() => _$PropertyToJson(this);

  @override
  String toString() => 'Property($address, $postcode)';
}
```

**WasteItem.dart** (similar structure)

**RecyclingCentre.dart** (similar structure)

**ServiceAlert.dart** (similar structure)

**Report.dart** (similar structure)

### 4.3 Enum Definitions

```dart
// lib/data/models/enums.dart

enum BinType {
  rubbish('general'),
  recycling('recycling'),
  garden('garden'),
  food('food'),
  recyclingCentre('recycling-centre');

  const BinType(this.value);
  final String value;

  String get label {
    switch (this) {
      case BinType.rubbish:
        return 'Rubbish';
      case BinType.recycling:
        return 'Recycling';
      case BinType.garden:
        return 'Garden Waste';
      case BinType.food:
        return 'Food Waste';
      case BinType.recyclingCentre:
        return 'Recycling Centre';
    }
  }
}

enum AlertSeverity {
  info('info'),
  warning('warning'),
  urgent('urgent');

  const AlertSeverity(this.value);
  final String value;
}

enum ReportType {
  missedBin('missed-bin'),
  flyTipping('fly-tipping'),
  streetLighting('street-lighting'),
  other('other');

  const ReportType(this.value);
  final String value;

  String get label {
    switch (this) {
      case ReportType.missedBin:
        return 'Missed Bin Collection';
      case ReportType.flyTipping:
        return 'Fly-Tipping';
      case ReportType.streetLighting:
        return 'Street Lighting';
      case ReportType.other:
        return 'Other Issue';
    }
  }
}
```

### 4.4 JSON Serialization

After defining models, run:

```bash
flutter pub run build_runner build
```

This generates `.g.dart` files with `fromJson` / `toJson` implementations.

---

## 5. SHARED COMPONENTS & WIDGETS

### 5.1 Common UI Components

**BinBadge Widget**

- **Purpose**: Display bin type with color coding
- **Used in**: WhatGoesWhereScreen, CollectionCard, elsewhere
- **Input**: `BinType` enum
- **Output**: Colored pill badge with text
- **Location**: `lib/presentation/widgets/common/bin_badge.dart`

**CollectionCard Widget**

- **Purpose**: Show next collection date for a bin type
- **Used in**: HomeScreen, FindBinDayScreen
- **Input**: `BinType`, `DateTime`, countdown integer
- **Output**: Card with icon, bin type, date, countdown text
- **Location**: `lib/presentation/widgets/common/collection_card.dart`

**ServiceAlertCard Widget**

- **Purpose**: Display service alert with severity styling
- **Used in**: ServiceAlertsScreen, HomeScreen
- **Input**: `ServiceAlert` object
- **Output**: Card with title, message, date range, severity badge
- **Location**: `lib/presentation/widgets/common/service_alert_card.dart`

**AddressSearch Widget**

- **Purpose**: Postcode input + address dropdown
- **Used in**: SplashScreen (address selection), SettingsScreen
- **Input**: List of `Property` objects
- **Output**: Selected `Property` via callback
- **Location**: `lib/presentation/widgets/forms/address_search_field.dart`

**PrimaryButton / SecondaryButton**

- **Purpose**: Consistent button styling
- **Used in**: All screens
- **Location**: `lib/presentation/widgets/common/buttons.dart`

**BottomNavigationBar (Custom)**

- **Purpose**: Navigate between main screens
- **Used in**: App-level scaffolding
- **Items**: Home, Find Bin Day, What Goes Where, Recycling Centres, Service Alerts, Report Issue
- **Location**: `lib/presentation/widgets/common/app_navigation.dart`

**CustomAppBar**

- **Purpose**: Consistent header with address display + action buttons
- **Used in**: Most screens except SplashScreen
- **Location**: `lib/presentation/widgets/common/custom_app_bar.dart`

### 5.2 Form Components

**PostcodeInputField**

- Validation: Format PE30 1XX (case-insensitive)
- Error handling: Show friendly format example
- Location: `lib/presentation/widgets/forms/postcode_input.dart`

**IssueTypeDropdown**

- Options: Missed Bin, Fly-Tipping, Street Lighting, Other
- Location: `lib/presentation/widgets/forms/issue_type_dropdown.dart`

**PhotoPickerButton**

- Integration: image_picker package
- Validation: <5MB, images only
- Location: `lib/presentation/widgets/forms/photo_picker_button.dart`

**LocationPickerButton**

- Integration: geolocator package
- Fallback: Manual coordinates input
- Location: `lib/presentation/widgets/forms/location_picker_button.dart`

### 5.3 Utilities & Helpers

**DateUtils.dart** (port of dates.ts)

```dart
// Constants
const List<String> bankHolidays2024_2025 = [
  '2024-12-25',
  '2024-12-26',
  '2025-01-01',
  // ... (complete list)
];

// Functions
bool isBankHoliday(DateTime date);
DateTime getNextCollectionDate(int dayOfWeek, {DateTime? fromDate});
String formatDate(DateTime date);                  // "Monday 15 December"
String getDayName(int dayOfWeek);
int getDaysUntil(DateTime date);
```

**PostcodeUtils.dart** (port of postcodes.ts)

```dart
bool validatePostcode(String postcode);
String normalizePostcode(String postcode);
```

**ColorUtils.dart**

```dart
Color getBinTypeColor(BinType binType);
Color getAlertSeverityColor(AlertSeverity severity);
```

**Constants.dart**

```dart
// App version, URLs, thresholds
class AppConstants {
  static const String appVersion = '1.0.0';
  static const int maxPhotoSize = 5 * 1024 * 1024;  // 5MB
  // ... more
}
```

### 5.4 Reusable Patterns

**Empty State Widget**

- Used when: No results, no alerts, no reports
- Location: `lib/presentation/widgets/common/empty_state.dart`

**Loading Skeleton**

- Used during: Data loading, image loading
- Location: `lib/presentation/widgets/common/loading_skeleton.dart`

**ErrorWidget**

- Used when: Data fetch fails, form validation errors
- Location: `lib/presentation/widgets/common/error_widget.dart`

---

## 6. NAVIGATION & ROUTING STRATEGY

### 6.1 go_router Configuration

**lib/config/routing/app_router.dart**

```dart
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Route names (constants for type-safe navigation)
const String homeRoute = '/home';
const String findBinDayRoute = '/find-bin-day';
const String whatGoesWhereRoute = '/what-goes-where';
const String recyclingCentresRoute = '/recycling-centres';
const String serviceAlertsRoute = '/service-alerts';
const String reportIssueRoute = '/report-issue';
const String settingsRoute = '/settings';
const String adminRoute = '/admin';
const String splashRoute = '/';

// Riverpod provider for GoRouter
final appRouterProvider = Provider<GoRouter>((ref) {
  final selectedProperty = ref.watch(propertyProvider);

  return GoRouter(
    routes: [
      GoRoute(
        path: splashRoute,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: homeRoute,
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: findBinDayRoute,
        builder: (context, state) => const FindBinDayScreen(),
      ),
      GoRoute(
        path: whatGoesWhereRoute,
        builder: (context, state) => const WhatGoesWhereScreen(),
      ),
      GoRoute(
        path: recyclingCentresRoute,
        builder: (context, state) => const RecyclingCentresScreen(),
      ),
      GoRoute(
        path: serviceAlertsRoute,
        builder: (context, state) => const ServiceAlertsScreen(),
      ),
      GoRoute(
        path: reportIssueRoute,
        builder: (context, state) => const ReportIssueScreen(),
      ),
      GoRoute(
        path: settingsRoute,
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: adminRoute,
        builder: (context, state) => const AdminScreen(),
      ),
    ],
    redirect: (context, state) {
      // Redirect to splash if no address selected (except for splash, settings, admin)
      if (selectedProperty == null &&
          ![splashRoute, settingsRoute, adminRoute].contains(state.path)) {
        return splashRoute;
      }
      return null;
    },
  );
});
```

### 6.2 Navigation Flow Diagram

```
SPLASH (Address Selection)
  ├─ If NO address → stay on Splash
  └─ If address selected → HOME

HOME
  ├─ [Home icon] → HOME
  ├─ [Find Bin Day icon] → FIND_BIN_DAY
  ├─ [What Goes Where icon] → WHAT_GOES_WHERE
  ├─ [Recycling Centres icon] → RECYCLING_CENTRES
  ├─ [Alerts icon] → SERVICE_ALERTS
  ├─ [Report icon] → REPORT_ISSUE
  ├─ [Settings icon in AppBar] → SETTINGS
  └─ [Admin icon in AppBar] → ADMIN

All screens (except Settings, Admin):
  └─ [Change Address button] → SETTINGS → SPLASH (address clear)

Report Issue:
  └─ After submission → Confirmation dialog
```

### 6.3 Deep Linking (Future)

When backend is added, support deep links:

```
westnorfolkwaste://home
westnorfolkwaste://alert/{alertId}
westnorfolkwaste://report/{referenceNumber}
```

---

## 7. PHASE-BY-PHASE IMPLEMENTATION PLAN

### PHASE 0: SETUP & SCAFFOLD (Duration: 2-3 hours)

**Objective**: Create Flutter project structure, configure Riverpod, set up basic theming.

**Tasks**:

1. Create new Flutter project

   ```bash
   flutter create --org com.simonlowes west_norfolk_waste
   ```

2. Update `pubspec.yaml` with all dependencies from Section 3.1

3. Run `flutter pub get`

4. Create folder structure as defined in Section 2.1

5. Generate Material 3 theme in `lib/config/theme/app_theme.dart`

   - Define colors matching GOV.UK palette
   - Define typography (Material 3 cascade)
   - Define component themes (AppBarTheme, ButtonThemeData, etc.)

6. Create `lib/config/routing/app_router.dart` with route definitions

7. Create `main.dart` entry point with Flutter Riverpod setup

   ```dart
   import 'package:flutter_riverpod/flutter_riverpod.dart';

   void main() {
     runApp(const ProviderScope(child: MyApp()));
   }
   ```

8. Create basic `lib/main.dart` shell with MaterialApp + GoRouter

**Success Criteria**:

- [ ] `flutter run` builds without errors
- [ ] App displays basic Material 3 scaffold
- [ ] Theme colors are correct
- [ ] Folder structure is complete

**Risks**:

- Dependency version conflicts → resolve by running `flutter pub upgrade` and checking Flutter version compatibility
- Riverpod setup complexity → follow official Riverpod documentation examples

---

### PHASE 1: DATA MODELS & REPOSITORIES (Duration: 3-4 hours)

**Objective**: Define all Dart models and create local data repositories.

**Tasks**:

1. **Create all model files** in `lib/data/models/`:

   - `property.dart`
   - `waste_item.dart`
   - `recycling_centre.dart`
   - `service_alert.dart`
   - `report.dart`
   - `enums.dart` (BinType, AlertSeverity, ReportType)

2. **Add json_serializable annotations** to all models

3. **Run code generator**:

   ```bash
   flutter pub run build_runner build
   ```

4. **Create mock data** in `lib/data/sample_data/`:

   - `mock_properties.dart` → List of West Norfolk postcodes with collection days
   - `mock_waste_items.dart` → ~200 waste items (port from Spark data or API)
   - `mock_recycling_centres.dart` → 5-10 HWRC locations in West Norfolk
   - `mock_alerts.dart` → 2-3 sample service alerts
   - `mock_reports.dart` → Empty list (generated on submission)

5. **Create repository interfaces** in `lib/data/repositories/`:

   - `property_repository.dart` → get all, get by id, save, delete
   - `waste_repository.dart` → get all, search by name
   - `alert_repository.dart` → get all, filter by date/postcode, create, delete
   - `report_repository.dart` → get all, create
   - Each uses `shared_preferences` for persistence

6. **Implement repositories** with localStorage backend

**Success Criteria**:

- [ ] All models compile without errors
- [ ] `.g.dart` files generated correctly
- [ ] Repositories can CRUD all data types
- [ ] Mock data loads without exceptions
- [ ] `json_serializable` code generation works

**Risks**:

- Mock data structure doesn't match Spark → ensure exact parity from screen_mapping.md
- SharedPreferences serialization → test json encode/decode round-trips
- Code generator not running → clear build cache: `flutter clean && flutter pub get`

---

### PHASE 2: RIVERPOD PROVIDERS & STATE MANAGEMENT (Duration: 2-3 hours)

**Objective**: Set up state management layer using Riverpod providers.

**Tasks**:

1. **Create providers** in `lib/presentation/providers/`:

   **property_provider.dart**

   ```dart
   // Currently selected property
   final propertyProvider = StateNotifierProvider<PropertyNotifier, Property?>((ref) {
     return PropertyNotifier(ref.watch(propertyRepositoryProvider));
   });
   ```

   **properties_provider.dart**

   ```dart
   // All properties (for address search)
   final propertiesProvider = FutureProvider((ref) async {
     return ref.watch(propertyRepositoryProvider).getAll();
   });
   ```

   **waste_items_provider.dart**

   ```dart
   // All waste items
   final wasteItemsProvider = FutureProvider((ref) async {
     return ref.watch(wasteRepositoryProvider).getAll();
   });

   // Search results
   final wasteSearchProvider = StateProvider((ref) => '');
   final filteredWasteItemsProvider = FutureProvider((ref) async {
     final query = ref.watch(wasteSearchProvider);
     final items = await ref.watch(wasteItemsProvider.future);
     return items.where((item) =>
       item.name.toLowerCase().contains(query.toLowerCase())
     ).toList();
   });
   ```

   **alerts_provider.dart**

   ```dart
   final alertsProvider = FutureProvider((ref) async {
     return ref.watch(alertRepositoryProvider).getAll();
   });

   // Filtered for home screen
   final activeAlertsProvider = FutureProvider.family(
     (ref, String? postcode) async {
       final alerts = await ref.watch(alertsProvider.future);
       return ref.watch(alertRepositoryProvider)
         .filterActive(alerts, postcode);
     }
   );
   ```

   **recycling_centres_provider.dart**

   ```dart
   final recyclingCentresProvider = FutureProvider((ref) async {
     return ref.watch(recyclingCentreRepositoryProvider).getAll();
   });
   ```

   **reports_provider.dart**

   ```dart
   final reportsProvider = FutureProvider((ref) async {
     return ref.watch(reportRepositoryProvider).getAll();
   });
   ```

2. **Create StateNotifier classes** for mutable state (properties, reports, alerts)

3. **Create utility providers** for derived state:

   - `nextCollectionDateProvider` → calculates next date for each bin type
   - `daysUntilProvider` → countdown integer
   - `collectionsSortedProvider` → HomeScreen's sorted 4-bin view

4. **Test providers** by viewing them in a debug console (use `ConsumerWidget` in test screen)

**Success Criteria**:

- [ ] All providers compile
- [ ] Providers correctly expose data from repositories
- [ ] Filtered/derived state works correctly
- [ ] No infinite loop exceptions

**Risks**:

- Provider dependencies circular → check dependency graph carefully
- Async provider resolution → ensure proper FutureProvider usage
- StateNotifier mutations not updating UI → test with Consumer widget

---

### PHASE 3: SHARED WIDGETS & THEME (Duration: 3-4 hours)

**Objective**: Build reusable UI components and finalize theming.

**Tasks**:

1. **Create theme files**:

   - `lib/config/theme/colors.dart` → Color constants
   - `lib/config/theme/typography.dart` → TextStyle definitions
   - `lib/config/theme/app_theme.dart` → Material 3 theme setup

2. **Create common widgets** in `lib/presentation/widgets/common/`:

   - `bin_badge.dart` → Colored badge for bin types
   - `collection_card.dart` → Card showing next collection date
   - `service_alert_card.dart` → Alert display card
   - `custom_app_bar.dart` → Header with address + buttons
   - `app_navigation.dart` → Bottom navigation bar
   - `buttons.dart` → PrimaryButton, SecondaryButton
   - `empty_state.dart` → "No results" placeholder
   - `loading_skeleton.dart` → Shimmer loading state
   - `error_widget.dart` → Error display with retry

3. **Create form widgets** in `lib/presentation/widgets/forms/`:

   - `address_search_field.dart` → Postcode + address dropdown
   - `postcode_input.dart` → Validated postcode input
   - `issue_type_dropdown.dart` → Report type selector
   - `photo_picker_button.dart` → Image picker integration
   - `location_picker_button.dart` → Geolocation button

4. **Create utility functions** in `lib/utils/`:

   - `date_utils.dart` → Port dates.ts logic
   - `postcode_utils.dart` → Postcode validation
   - `color_utils.dart` → Bin type → color mapping
   - `constants.dart` → App constants, bank holidays

5. **Test widgets** with sample data

**Success Criteria**:

- [ ] All widgets render without errors
- [ ] Colors match GOV.UK palette exactly
- [ ] Touch targets are 48x48dp minimum
- [ ] Form validation works
- [ ] Widgets are responsive (mobile + tablet)

**Risks**:

- Color values not matching Spark → use design specification from PRD
- Widget complexity → start simple, add features incrementally
- Form validation UX → test with various inputs

---

### PHASE 4: SCREENS - PART A (Duration: 4-5 hours)

**Objective**: Implement Screens 1-4 (HomeScreen, FindBinDayScreen, WhatGoesWhereScreen, RecyclingCentresScreen).

**Tasks**:

**4A: HomeScreen**

- Display selected property address + postcode
- Show next 4 collection dates sorted chronologically
- Display active service alerts filtered by postcode
- Include "Change address" button linking to Settings
- Include navigation to other screens
- Use CollectionCard widget
- Use ServiceAlertCard widget

**4B: FindBinDayScreen**

- Display grid of 4 bin types
- Show next collection date for each
- Show countdown days
- Allow optional address lookup/change
- Responsive: 2 columns on tablet, 1 on mobile

**4C: WhatGoesWhereScreen**

- Search input for waste items
- Real-time filtering as user types
- Display matching items with BinBadge
- Show disposal notes
- Empty state when no results
- Keyboard search support

**4D: RecyclingCentresScreen**

- List of recycling centres
- For each: name, address, opening hours, notes
- "Get directions" button → Google Maps
- Handle geolocation (optional for sorting by distance)

**Implementation Pattern** (per screen):

1. Create `screens/{screen_name}/{screen_name}_screen.dart`
2. Create `screens/{screen_name}/{screen_name}_viewmodel.dart` (if state logic needed)
3. Use ConsumerWidget or ConsumerStatefulWidget
4. Connect to Riverpod providers
5. Build UI with theme + common widgets
6. Add error/loading states
7. Handle navigation

**Success Criteria**:

- [ ] All 4 screens render data from providers
- [ ] Navigation between screens works
- [ ] Search/filtering logic works
- [ ] External links (Maps) open correctly
- [ ] Responsive on mobile + tablet

**Risks**:

- Google Maps intent doesn't work on Android → test on device
- Search performance with large lists → implement debouncing if needed
- Missing mock data → ensure mock files are complete

---

### PHASE 5: SCREENS - PART B (Duration: 4-5 hours)

**Objective**: Implement Screens 5-7 (ServiceAlertsScreen, ReportIssueScreen, SettingsScreen, plus SplashScreen).

**Tasks**:

**5A: ServiceAlertsScreen**

- Display all active service alerts
- Filter by:
  - Date range (startDate ≤ now ≤ endDate)
  - Postcode (if user address selected)
- Sort by severity (urgent first)
- Use ServiceAlertCard widget
- Empty state when no alerts
- Show dismissed alerts after end date (or hide them)

**5B: ReportIssueScreen**

- Form with fields:
  - Issue type (dropdown)
  - Description (textarea)
  - Photo (optional, image picker)
  - Location (optional, geolocator)
- Validation: type + description required, photo <5MB
- On submit:
  - Generate reference number: `WN${timestamp}`
  - Save to reports provider
  - Show confirmation dialog with reference
  - Offer "Report another" or "Back to home"

**5C: SettingsScreen**

- Display current property:
  - Address
  - Postcode
  - "Change address" button
- App info:
  - Version number (from AppConstants)
  - Link to privacy policy (placeholder)
  - Link to contact council (placeholder)

**5D: SplashScreen / Address Selection**

- If no property selected → show welcome message + address search
- Postcode input with validation
- Address dropdown populated from properties provider
- On selection → navigate to HomeScreen
- Include helpful hints ("e.g., PE30 1XX")

**Implementation Pattern**: Same as PHASE 4

**Success Criteria**:

- [ ] All 4 screens functional
- [ ] Form validation works
- [ ] Photo picker integrates correctly
- [ ] Geolocation permission handling works
- [ ] Reports save and reference number displays
- [ ] Address selection persists across sessions

**Risks**:

- Permission dialogs on iOS/Android → test on physical devices
- Image picker compatibility → test on both platforms
- Form validation UX → iterate based on testing
- Geolocation timeout → implement timeout + fallback

---

### PHASE 6: ADMIN SCREEN & COMPLETION (Duration: 2-3 hours)

**Objective**: Implement AdminScreen, finalize state management, error handling.

**Tasks**:

**6A: AdminScreen**

- Form to create service alerts:
  - Title (text input)
  - Message (textarea)
  - Severity (dropdown: info/warning/urgent)
  - Start date (date picker)
  - End date (date picker)
  - Affected postcodes (text input, comma-separated)
- Validation: all fields required, endDate > startDate
- List of existing alerts with:
  - Status badge (active/inactive)
  - Delete button
- On submit → add to alerts provider + show confirmation

**6B: Error Handling & Edge Cases**

- Add try-catch blocks to repository operations
- Implement error widgets for failed data loads
- Add retry buttons
- Handle missing data gracefully
- Handle network errors (future, when backend exists)

**6C: Loading States**

- Implement loading skeletons for data-heavy screens
- Show spinners during form submission
- Prevent multiple submissions

**Success Criteria**:

- [ ] AdminScreen fully functional
- [ ] All error cases handled gracefully
- [ ] Loading states display correctly
- [ ] No unhandled exceptions in logs

**Risks**:

- Date picker UX → test on both platforms
- Postcode parsing → handle whitespace, case sensitivity
- Admin access control → (not implemented yet, but flag for future)

---

### PHASE 7: TESTING & QUALITY (Duration: 3-4 hours)

**Objective**: Add unit tests, widget tests, and integration tests; verify all features work.

**Tasks**:

1. **Unit Tests** in `test/unit/`:

   - `date_utils_test.dart`

     - Test `getNextCollectionDate()` for all days
     - Test bank holiday adjustments
     - Test `getDaysUntil()` edge cases

   - `postcode_utils_test.dart`

     - Test postcode validation (valid/invalid formats)

   - `property_model_test.dart`
     - Test model serialization round-trips

2. **Widget Tests** in `test/widget/`:

   - `home_screen_test.dart`

     - Test HomeScreen renders with property
     - Test alerts display correctly
     - Test navigation buttons

   - `collection_card_test.dart`

     - Test CollectionCard renders bin type, date, countdown

   - `app_test.dart`
     - Smoke test: app launches, navigation works

3. **Integration Tests** in `test/integration/`:

   - `app_flow_test.dart`
     - User selects address → HomeScreen shows data
     - User searches waste items → results filter
     - User submits report → reference displays

4. **Manual Testing Checklist**:

   - [ ] Test on iPhone 13, iPhone SE (small screen)
   - [ ] Test on Android Pixel 4, Samsung Galaxy S20
   - [ ] Test portrait + landscape orientations
   - [ ] Test with system accessibility features enabled
   - [ ] Test with slow network (throttle in DevTools)
   - [ ] Test on iOS 12+ and Android 8+

5. **Accessibility Testing**:

   - Verify color contrast (use WAVE browser extension analogue)
   - Test screen reader (TalkBack on Android, VoiceOver on iOS)
   - Test touch targets (all ≥ 48x48dp)
   - Test text scaling (use system text size controls)

6. **Performance Review**:
   - Profile app with Flutter DevTools
   - Check for jank in list scrolling
   - Verify image loading doesn't block UI
   - Check memory usage (search is not causing leaks)

**Success Criteria**:

- [ ] Unit test coverage > 60%
- [ ] All widget tests pass
- [ ] Integration test passes
- [ ] No unhandled exceptions
- [ ] App responsive on all tested devices
- [ ] Accessibility compliance verified

**Risks**:

- Test setup complexity → use test utilities from flutter_test
- Device-specific bugs → test on real devices, not just emulator
- Performance issues → profile early and often

---

### PHASE 8: DOCUMENTATION & CODE CLEANUP (Duration: 2 hours)

**Objective**: Write documentation, clean up code, prepare for release.

**Tasks**:

1. **Create README.md**:

   - Project overview
   - Prerequisites (Flutter 3.16+, Dart 3.2+)
   - Setup instructions (clone, `flutter pub get`, `flutter run`)
   - Folder structure explanation
   - Architecture diagram
   - How to add new screens
   - How to add new providers
   - Known limitations & future work
   - Contact/support info

2. **Create ARCHITECTURE.md**:

   - Riverpod architecture explanation
   - Data flow diagram
   - State management strategy
   - How repositories work
   - How to handle async operations

3. **Create DESIGN_DECISIONS.md**:

   - Why Riverpod? (vs Provider, Bloc, etc.)
   - Why go_router? (vs Navigator 2.0)
   - Color palette justification
   - Responsive design approach
   - Migration notes from Spark

4. **Code Cleanup**:

   - Remove debug print statements
   - Add comprehensive comments to complex logic
   - Ensure consistent code style (use `flutter format` + `flutter analyze`)
   - Remove unused imports
   - Add dartdoc comments to all public APIs

5. **Linting**:

   ```bash
   flutter analyze
   flutter format --line-length 80 lib test
   ```

6. **Final Build**:
   ```bash
   flutter clean
   flutter pub get
   flutter pub run build_runner build
   flutter build apk --release  # Android
   flutter build ipa --release  # iOS (requires macOS)
   ```

**Success Criteria**:

- [ ] README complete and accurate
- [ ] No analyzer warnings
- [ ] Code formatted consistently
- [ ] All tests passing
- [ ] App builds in release mode without errors

---

### PHASE 9: DEPLOYMENT PREP & OPTIONAL ENHANCEMENTS (Duration: 2-3 hours)

**Objective**: Prepare for app store submission; add optional nice-to-have features.

**Tasks**:

1. **App Configuration**:

   - Create app icon (use flutter_launcher_icons package)
   - Configure app name and version in `pubspec.yaml`
   - Set minimum SDK versions (iOS 12, Android 8)
   - Add app description and privacy policy links

2. **Optional Enhancements** (if time allows):

   - [ ] **Animations**: Add page transitions, collection countdown animation
   - [ ] **Offline Mode**: Cache API responses, show last-updated timestamps
   - [ ] **Dark Mode**: Support Material 3 dark theme
   - [ ] **Push Notifications**: Integrate Firebase Cloud Messaging (needs backend)
   - [ ] **Location Map View**: Google Maps integration for recycling centres
   - [ ] **Web Support**: Responsive design for tablet/web (go_router supports this)
   - [ ] **Multi-language**: Internationalization (flutter_localizations + intl)

3. **Store Submission Prep** (future, when ready):
   - iOS: Create App Store Connect account, certificates, provisioning profiles
   - Android: Create Google Play Developer account, signing key
   - Privacy Policy & Terms of Service pages
   - App store screenshots & descriptions
   - Release notes

**Success Criteria**:

- [ ] App ready for beta testing
- [ ] App icon displays correctly
- [ ] App info correct in About screen
- [ ] Smooth, stable performance

---

## 8. RISK ASSESSMENT & MITIGATION

### 8.1 Technical Risks

| Risk                                                           | Probability | Impact | Mitigation                                                                   |
| -------------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------- |
| **Dependency conflicts** (Riverpod + go_router version issues) | Medium      | High   | Pin exact versions, test frequently, use `flutter doctor -v`                 |
| **Date/time edge cases** (DST, timezone, bank holidays)        | Medium      | Medium | Comprehensive unit tests, hard-coded holiday list maintained                 |
| **Location permission denials** (iOS/Android)                  | Low         | Low    | Graceful fallback, work without location, show helpful message               |
| **Image/photo handling** (memory issues, device differences)   | Low         | Medium | Resize images before saving, test on low-RAM devices                         |
| **Search performance** (large waste items list)                | Low         | Low    | Implement debouncing, consider pagination if >1000 items                     |
| **SharedPreferences limits** (max storage ~6MB)                | Very Low    | High   | If data exceeds limits, migrate to SQLite, not expected with current dataset |
| **Go Router deep linking failures**                            | Low         | Low    | Test all routes, use go_router's built-in debugging                          |

### 8.2 Design/UX Risks

| Risk                                   | Mitigation                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| **Colors don't match Spark exactly**   | Use design tokens from PRD, compare side-by-side, adjust oklch values if needed |
| **Touch targets too small**            | Audit all buttons/tappable elements, ensure 48x48dp minimum                     |
| **Accessibility issues**               | Test with screen readers, check color contrast ratios                           |
| **Responsive layout breaks on tablet** | Test on 7" and 12" devices, use MediaQuery breakpoints                          |

### 8.3 Process Risks

| Risk                                                  | Mitigation                                                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Scope creep** (adding features beyond Spark parity) | Strictly limit to matching Spark features, document future enhancements separately   |
| **Code generation failures** (build_runner issues)    | Clear cache frequently: `flutter clean`                                              |
| **Testing gaps**                                      | Prioritize critical paths (address selection → home), write tests as code is written |
| **Merge conflicts** (if working with team)            | Use feature branches, communicate phase boundaries                                   |

### 8.4 Missing Information & Assumptions

| Assumption                                                                   | Impact if Wrong                 | Mitigation                                                            |
| ---------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| **Mock data is accurate** (West Norfolk addresses, collection days, centres) | Screening data, broken features | Validate mock data with stakeholders, plan API integration            |
| **Postcode → address lookup exists**                                         | Address selection breaks        | Implement mock dropdown for now, integrate real API later             |
| **Google Maps intent works on all devices**                                  | Can't open directions           | Fallback to web URL, allow manual coordinate entry                    |
| **Geolocation always available**                                             | Report location capture breaks  | Make location optional, show helpful error message                    |
| **Backend will be built later**                                              | Harder to refactor repositories | Design repositories as clean abstractions, easy to swap for API calls |

---

## 9. SUCCESS CRITERIA CHECKLIST

### 9.1 Feature Parity with Spark

- [ ] **HomeScreen**: Shows property address, next 4 collections, active alerts
- [ ] **FindBinDayScreen**: Grid of 4 bin types with dates and countdowns
- [ ] **WhatGoesWhereScreen**: Searchable waste item database with bin badges
- [ ] **RecyclingCentresScreen**: List of centres with directions button
- [ ] **ServiceAlertsScreen**: Displays active alerts filtered by date/postcode
- [ ] **ReportIssueScreen**: Form with type, description, photo, location; generates reference
- [ ] **SettingsScreen**: Shows address, "Change address" button, app info
- [ ] **AdminScreen**: Create/view/delete service alerts
- [ ] **Address Selection**: Postcode input + dropdown, persists across sessions
- [ ] **Error Handling**: No unhandled exceptions, graceful error messages
- [ ] **Loading States**: Show feedback during data loading

### 9.2 Technical Requirements

- [ ] Built with Flutter 3.16+ and Dart 3.2+
- [ ] Uses Material 3 design components
- [ ] Riverpod for state management
- [ ] go_router for navigation
- [ ] Responsive design (320dp - 1200dp+)
- [ ] iOS 12+ and Android 8+ support
- [ ] All models have json_serializable code generation
- [ ] Repositories use SharedPreferences for persistence

### 9.3 Design & Accessibility

- [ ] Colors match GOV.UK palette (oklch values)
- [ ] Bin type colors correct (rubbish, recycling, garden, food, centre)
- [ ] Touch targets minimum 48x48dp
- [ ] Text contrast ratios WCAG AA or better
- [ ] Screen reader compatible (TalkBack, VoiceOver)
- [ ] Text scaling supported (system text size settings)
- [ ] Keyboard navigation works
- [ ] Icons have text labels

### 9.4 Code Quality

- [ ] No analyzer warnings (`flutter analyze` clean)
- [ ] Code formatted with `flutter format`
- [ ] Consistent naming conventions (camelCase, SCREAMING_SNAKE_CASE)
- [ ] Public APIs have dartdoc comments
- [ ] Complex logic has inline comments
- [ ] No dead code or unused imports
- [ ] Unit test coverage > 60%
- [ ] All integration tests pass

### 9.5 Documentation

- [ ] README.md with setup instructions
- [ ] Architecture.md explaining state management
- [ ] Design decisions documented
- [ ] Folder structure explained
- [ ] How to add new screens documented
- [ ] API migration strategy documented

### 9.6 Performance & Stability

- [ ] App launches in < 3 seconds
- [ ] List scrolling smooth (60 FPS)
- [ ] No memory leaks (check with DevTools)
- [ ] App doesn't crash on edge cases (no address, empty results, etc.)
- [ ] Handles offline gracefully
- [ ] Works on low-RAM devices (~2GB)

---

## APPENDIX: IMPLEMENTATION CHECKLIST

Use this checklist to track progress across all phases:

```
PHASE 0: SETUP
  [ ] Flutter project created
  [ ] pubspec.yaml dependencies added
  [ ] Folder structure created
  [ ] Material 3 theme configured
  [ ] go_router basic setup
  [ ] main.dart entry point works
  [ ] App builds and runs

PHASE 1: DATA MODELS
  [ ] Property model created
  [ ] WasteItem model created
  [ ] RecyclingCentre model created
  [ ] ServiceAlert model created
  [ ] Report model created
  [ ] Enums defined
  [ ] Code generator run (build_runner)
  [ ] Mock data files created
  [ ] Repositories implemented
  [ ] SharedPreferences integration works

PHASE 2: PROVIDERS
  [ ] propertyProvider created
  [ ] propertiesProvider created
  [ ] wasteItemsProvider + search created
  [ ] alertsProvider + filtering created
  [ ] recyclingCentresProvider created
  [ ] reportsProvider created
  [ ] Derived providers (nextCollectionDate, etc.) created
  [ ] Providers tested with test app

PHASE 3: WIDGETS & THEME
  [ ] Colors defined in colors.dart
  [ ] Typography defined
  [ ] Material 3 theme complete
  [ ] BinBadge widget created
  [ ] CollectionCard widget created
  [ ] ServiceAlertCard widget created
  [ ] CustomAppBar widget created
  [ ] BottomNavigationBar widget created
  [ ] Address search widget created
  [ ] Form widgets created
  [ ] Utility functions ported (date, postcode, color)

PHASE 4: SCREENS A
  [ ] HomeScreen implemented
  [ ] FindBinDayScreen implemented
  [ ] WhatGoesWhereScreen implemented
  [ ] RecyclingCentresScreen implemented
  [ ] All screens render data correctly
  [ ] Navigation between screens works

PHASE 5: SCREENS B
  [ ] ServiceAlertsScreen implemented
  [ ] ReportIssueScreen implemented (with form validation)
  [ ] SettingsScreen implemented
  [ ] SplashScreen (address selection) implemented
  [ ] Form submissions work
  [ ] Address persistence works
  [ ] Photo picker integrates
  [ ] Geolocation integrates

PHASE 6: ADMIN & POLISH
  [ ] AdminScreen implemented
  [ ] Error handling added throughout
  [ ] Loading states implemented
  [ ] Retry buttons working
  [ ] All edge cases handled

PHASE 7: TESTING
  [ ] Unit tests written (date, postcode utils)
  [ ] Unit tests written (models)
  [ ] Widget tests written (key screens)
  [ ] Integration tests written
  [ ] All tests passing
  [ ] Code coverage > 60%
  [ ] Manual testing on iOS device
  [ ] Manual testing on Android device
  [ ] Accessibility audit passed

PHASE 8: DOCUMENTATION
  [ ] README.md written
  [ ] Architecture.md written
  [ ] Design decisions documented
  [ ] Code formatted
  [ ] Analyzer warnings cleared
  [ ] Release build successful

PHASE 9: DEPLOYMENT PREP
  [ ] App icon created
  [ ] Version numbers set
  [ ] Min SDK versions set
  [ ] App info correct
  [ ] Optional features considered
  [ ] Privacy policy links added
```

---

## SUMMARY

This plan provides a structured, phase-by-phase approach to migrating the Spark West Norfolk Waste & Recycling app to Flutter. Key highlights:

1. **Phase 0-3** (7-10 hours): Setup, data models, state management, widgets
2. **Phase 4-6** (10-12 hours): Screen implementation, admin, error handling
3. **Phase 7-9** (7-9 hours): Testing, documentation, deployment prep

**Total Effort**: ~4-6 weeks for 1 developer, can be parallelized to 2-3 weeks with 2 developers.

**Next Steps**:

1. Review and refine this plan with team/stakeholders
2. Identify any missing requirements or constraints
3. Obtain approval to proceed with Phase 0
4. Create GitHub issues for each task
5. Set up development environment

---

**Document Version**: 1.0  
**Date**: December 4, 2025  
**Author**: AI Assistant  
**Status**: Ready for Review
