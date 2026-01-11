# West Norfolk Waste & Recycling - Autonomous Build

## CRITICAL: AUTONOMOUS EXECUTION RULES

**YOU ARE RUNNING UNATTENDED OVERNIGHT. ZERO USER INTERACTION.**

1. **NEVER** ask for confirmation, clarification, or approval
2. **NEVER** present numbered options for the user to choose
3. **NEVER** wait for user input of any kind
4. **NEVER** say "shall I proceed?" or "would you like me to..."
5. **ALWAYS** make decisions yourself based on best practices
6. **ALWAYS** pick the most standard/common approach when multiple exist
7. **ALWAYS** proceed immediately after completing each step
8. If something fails, fix it yourself and continue
9. If ambiguous, choose sensibly and document in PROGRESS.md
10. Execute ALL tasks to completion without stopping

## Project Context

**App**: West Norfolk Waste & Recycling
**Platform**: Flutter (iOS, Android, Web)
**State Management**: Riverpod
**Routing**: GoRouter
**Specs**: See `../../PRD.md` and `../../screen_mapping.md`

## MULTI-AGENT ORCHESTRATION

You are the **Orchestrator**. Spawn subagents using the Task tool to parallelize work.

### Subagent Preamble (REQUIRED)

Every subagent prompt MUST start with:
```
AUTONOMOUS MODE - ZERO USER INTERACTION
- Do NOT ask questions or present options
- Do NOT wait for confirmation
- Make all decisions yourself
- If something fails, fix it and continue
- When complete, create your READY file
```

---

## PHASE 1: Analysis (Run First)

### Subagent: Analyzer
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Read ../../PRD.md thoroughly
2. Read ../../screen_mapping.md
3. Analyze all existing code in lib/
4. Create ANALYSIS.md documenting:
   - What features are COMPLETE
   - What features are INCOMPLETE or MISSING
   - What bugs or issues exist
   - What needs to be done for MVP
5. List specific files that need work

COMPLETION: Create file ANALYSIS.md with findings
```

---

## PHASE 2: Core Features (Parallel - After Analysis)

### Subagent: Address & Collections
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Read ANALYSIS.md for context
2. Implement/complete Address Selection:
   - Postcode lookup functionality
   - Address list display
   - Address persistence with SharedPreferences
   - Settings screen address management
3. Implement/complete Collection Schedule:
   - Fetch collection dates for selected property
   - Display next collections by bin type
   - Handle bank holiday adjustments
   - Calendar integration (optional)
4. Ensure HomeScreen displays collections correctly
5. Test the flow: select address → see collections

COMPLETION: Create file READY_COLLECTIONS containing "Collections complete"
```

### Subagent: Waste Lookup
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Read ANALYSIS.md for context
2. Implement/complete What Goes Where screen:
   - Searchable item database
   - Filter by item name (fuzzy search)
   - Display which bin each item goes in
   - Show special disposal notes
   - Visual bin type indicators
3. Create/update waste_items data source
4. Ensure smooth UX with instant search results

COMPLETION: Create file READY_WASTE_LOOKUP containing "Waste lookup complete"
```

### Subagent: Recycling Centres
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Read ANALYSIS.md for context
2. Implement/complete Recycling Centres screen:
   - List view of all centres
   - Map view with centre markers
   - Centre details: name, address, hours, materials accepted
   - Directions button (launch native maps)
   - Distance/proximity display
3. Create centres data source if missing
4. Handle location permissions gracefully

COMPLETION: Create file READY_CENTRES containing "Recycling centres complete"
```

---

## PHASE 3: Secondary Features (Parallel - After Phase 2)

### Subagent: Service Alerts
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Complete Service Alerts functionality:
   - Display active alerts on HomeScreen
   - Filter alerts by user postcode
   - Alert detail view
   - Dismissible alerts (but reappear until end date)
2. Complete Admin Alert Management:
   - Create/edit/delete alerts
   - Set affected postcodes
   - Set active date range
3. Create mock alert data for testing

COMPLETION: Create file READY_ALERTS containing "Alerts complete"
```

### Subagent: Issue Reporting
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Complete Report Issue screen:
   - Issue type selector (missed collection, fly-tipping, etc.)
   - Description text field
   - Photo attachment (camera/gallery)
   - Location picker (optional geolocation)
   - Form validation
   - Submit with confirmation reference
2. Store reports locally (demo mode)
3. Success confirmation screen

COMPLETION: Create file READY_REPORTING containing "Issue reporting complete"
```

---

## PHASE 4: Polish & MVP (After Phase 3)

### Subagent: Polish
```
AUTONOMOUS MODE - ZERO USER INTERACTION. Do NOT ask questions.

Working directory: /Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/flutter_app

Tasks:
1. Review all screens for consistency
2. Ensure proper error handling everywhere
3. Add loading states where missing
4. Add empty states where missing
5. Verify navigation flows work correctly
6. Check responsive layout on different screen sizes
7. Run flutter analyze and fix all issues
8. Run flutter test and fix failures
9. Ensure app builds: flutter build apk --debug
10. Update PROGRESS.md with final status

COMPLETION: Create file MVP_READY containing "MVP Complete - App ready for testing"
```

---

## Progress Tracking

Update PROGRESS.md after each phase:
```
# Build Progress

## Phase 1: Analysis
- [timestamp] Analyzer complete - see ANALYSIS.md

## Phase 2: Core Features  
- [timestamp] Collections complete
- [timestamp] Waste lookup complete
- [timestamp] Recycling centres complete

## Phase 3: Secondary Features
- [timestamp] Alerts complete
- [timestamp] Issue reporting complete

## Phase 4: Polish
- [timestamp] MVP complete
```

## Key Commands
```bash
flutter pub get        # Install dependencies
flutter analyze        # Check for issues
flutter test           # Run tests
flutter run            # Run on device
flutter build apk      # Build Android
flutter build ios      # Build iOS
```

## START IMMEDIATELY

Begin by spawning the Phase 1 Analyzer subagent NOW. After ANALYSIS.md exists, spawn all Phase 2 subagents in parallel. Continue through all phases until MVP_READY file exists.
