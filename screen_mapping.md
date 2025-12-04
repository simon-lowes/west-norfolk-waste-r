# SCREEN MAPPING TEMPLATE — Spark → Flutter

> This document must be COMPLETED by the Plan/Agent based on analysis of the Spark (React/TypeScript) project currently open in this workspace.  
> The goal is to produce a clear, screen-by-screen mapping from Spark to Flutter.

---

## 0. PROJECT SUMMARY

**Spark Project Root:** `./`

**Primary Frontend Stack:** React 19 + Vite + TypeScript (GitHub Spark framework), Tailwind CSS v4, Radix UI components

**Entry File(s):**

- `src/main.tsx` – Root entry point with error boundary wrapper
- `src/App.tsx` – Main application component with routing state and persistent storage

**High-level description of the app:**

- **Purpose:** West Norfolk Waste & Recycling is a civic service application that helps residents of the Borough Council of King's Lynn & West Norfolk manage their household waste and recycling needs. It provides real-time collection schedules, waste sorting guidance, recycling centre locations, service alerts, and issue reporting capabilities.

- **Main user personas:**

  1. Residents looking up their bin collection days and dates
  2. Residents unsure about waste disposal (what goes where)
  3. Residents finding nearby recycling centres
  4. Residents reporting missed collections or street issues
  5. Council staff managing service alerts and communications

- **Core flows:**
  1. Address selection → Collection schedule lookup (home screen)
  2. Search waste item → Find correct disposal bin type
  3. Browse recycling centres → Open directions in maps
  4. View active service alerts filtered by postcode
  5. Submit issue report with optional photo and geolocation
  6. Manage personal settings (change address, view app info)
  7. (Admin) Create and manage service alerts

---

## 1. SCREEN INDEX

List every user-facing screen/page in the Spark app.

For each, include:

- Screen ID (short name)
- Spark route/path/file
- Short description of purpose

**Actual Screen Index:**

| Screen ID           | Spark Route / File                                                        | Description                                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home`              | `'home'` state (`src/components/HomeScreen.tsx`)                          | Main dashboard displaying upcoming collection dates for the selected address (next 4 bins sorted by date) and active service alerts for the user's postcode(s). Shows address header with "Change" button and countdown information for each collection type.                            |
| `find-bin-day`      | `'find-bin-day'` state (`src/components/FindBinDayScreen.tsx`)            | Dedicated bin day lookup screen with grid view of all bin types (rubbish, recycling, garden, food). Displays next collection date, day name, and color-coded cards with countdown days until collection. Allows address selection/lookup.                                                |
| `what-goes-where`   | `'what-goes-where'` state (`src/components/WhatGoesWhereScreen.tsx`)      | Searchable waste item database with real-time filtering. Users search for disposal items and see matching results with bin type badges indicating proper disposal destination (general, recycling, garden, food, recycling-centre). Includes special instructions/notes per item.        |
| `recycling-centres` | `'recycling-centres'` state (`src/components/RecyclingCentresScreen.tsx`) | Directory of household waste recycling centres (HWRCs) with name, address, opening hours, notes, and "Get directions" button linking to Google Maps. List view with location pins indicating centre locations.                                                                           |
| `service-alerts`    | `'service-alerts'` state (`src/components/ServiceAlertsScreen.tsx`)       | Display of all active service alerts filtered by date range and user's postcode. Shows severity level (urgent/warning/info), title, message, date range, and affected postcodes. Empty state message when no alerts are active.                                                          |
| `report-issue`      | `'report-issue'` state (`src/components/ReportIssueScreen.tsx`)           | Issue reporting form for missed bins, fly-tipping, street lighting, or other problems. Includes: issue type dropdown, description textarea, optional photo upload (<5MB validation), optional geolocation capture, and submission. Returns confirmation screen with WN reference number. |
| `settings`          | `'settings'` state (`src/components/SettingsScreen.tsx`)                  | User preferences and app information. Shows current address with "Change address" button (which triggers address selector), and app version/info section. No authentication required. Accessible from header button.                                                                     |
| `admin`             | `'admin'` state (`src/components/AdminScreen.tsx`)                        | Admin panel for council staff to manage service alerts. Form to create new alerts with title, message, severity level, start/end dates, and comma-separated postcode list. View existing alerts with active/inactive status and delete functionality. Accessible via header button.      |

---

## 2. PER-SCREEN DETAILS

For each screen listed in Section 1, create a subsection using this template.

---

### 2.X `[SCREEN ID]` — `[Human Name]`

**Spark Source(s):**

- Entry component:
  - `path/to/file.tsx`
- Supporting components (if any):
  - `path/to/component1.tsx`
  - `path/to/component2.tsx`

**Spark Route / Navigation:**

- Route path: `/example`
- How user reaches this screen:
  - e.g. "From Home, clicking 'View Transactions' button"

**High-Level Purpose:**

- (1–3 sentences describing what this screen is for.)

**Key UI Sections:**  
List all major logical sections of the UI and how they appear.

- Section 1:
  - e.g. "Top summary bar showing total balance and key metrics"
- Section 2:
  - e.g. "Table/list of items with filters and pagination"
- Section 3:
  - e.g. "Form on the right-hand side for adding new records"

**Major Components (Spark side):**

- `ComponentName1` – purpose
- `ComponentName2` – purpose
- …

**User Inputs (forms / controls):**  
For each input, describe its role.

- Input name / label:
  - Type: (text, number, select, date, etc.)
  - Used for: (e.g. filter, create, update)
- …

**Displayed Data:**  
Describe what data is shown, its shape, and where it comes from.

- Data source (API / mock / local state):
- Data type (reference to TS interface if any):
  - e.g. `Transaction { id: string; date: string; amount: number; category: string; }`
- How it is grouped/sorted/paginated (if applicable).

**User Actions (behaviours):**  
List what the user can _do_ on this screen.

- Action: e.g. "Add new transaction"
  - Trigger: e.g. Button "Add"
  - Result: e.g. Updates local list and recalculates summary
- Action: e.g. "Remove item"
  - Trigger:
  - Result:
- …

**Validation / Error Handling (if any):**

- Validation rules:
- How errors are shown to the user:
- Any important edge cases:

**State Management (Spark):**

- Local state only? (React `useState`, `useReducer`?)
- Context / global store?
- Where is state initialised?

**Important Styling/Layout Notes:**

- Layout type: (single column / two-column / cards / table)
- Breakpoints / responsiveness behaviours:
- Any visually distinctive elements that Flutter should reproduce.

**Recommended Flutter Mapping (to be filled by agent):**

- Screen route:
  - e.g. `/home`
- Flutter widget structure (high level):
  - `Scaffold`
    - `AppBar` → (title, actions)
    - `body` → (Column / ListView / etc.)
- Likely state management:
  - e.g. "Use Riverpod provider `transactionsProvider` for data"
- Key reusable widgets:
  - e.g. `SummaryCard`, `TransactionList`, `PrimaryButton`

**Notes / Risks for Migration:**

- Any tricky UI/state interactions?
- Any Spark-specific patterns that don't map 1:1 to Flutter?
- Special animations or effects to approximate?

---

## 3. SHARED COMPONENTS & UTILITIES

List components/helpers that are reused across multiple screens in Spark and that likely need to become shared Flutter widgets/helpers.

**Shared UI Components:**

- `ComponentName` – used in screens: [home, settings, …] – purpose
- …

**Shared Utilities / Hooks / Helpers:**

- `useSomething.ts` – what it does
- `formatCurrency.ts` – formatting rules
- …

**Recommended Flutter Equivalents:**

- `lib/widgets/common/PrimaryButton.dart` – common button style
- `lib/utils/formatters.dart` – number/date/currency formatting
- …

---

## 4. DATA MODELS SUMMARY

List all TypeScript interfaces/types that are used in the app's data layer.

For each:

- TypeScript type:
  - `interface Transaction { ... }`
- Where it appears:
  - Files / screens
- Planned Dart model:
  - `class Transaction { ... }`

---

## 5. FINAL CHECKLIST FOR AGENT

Before migration work begins, the agent must ensure:

1. Every user-facing Spark screen appears in the Screen Index.
2. Every screen has a filled-out **Section 2.X** block.
3. Shared components and utilities are documented.
4. All TypeScript data models are listed.
5. Recommended Flutter mappings exist for all screens.

Only then should the agent move on to implementing the Flutter project per the main migration spec.

# END OF TEMPLATE
