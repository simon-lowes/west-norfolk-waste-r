# West Norfolk Waste & Recycling - Product Requirements Document

A civic service application that helps residents of the Borough Council of King's Lynn & West Norfolk manage their household waste and recycling needs, providing clear information about collection schedules, waste sorting guidance, and local facilities.

**Experience Qualities**:
1. **Trustworthy** - Government service design principles create confidence through familiar patterns, clear information hierarchy, and accessible language that respects all residents.
2. **Efficient** - Residents find answers in seconds rather than minutes, with their address remembered and collection dates front-and-center on every visit.
3. **Approachable** - Plain English, generous spacing, and familiar iconography make waste management feel simple rather than bureaucratic.

**Complexity Level**: Light Application (multiple features with basic state)
The app manages several interconnected features (bin lookup, item search, facility finder, alerts, reporting) with persistent user preferences and CRUD operations, but remains focused on information delivery rather than complex workflows or account management.

## Essential Features

### Address Selection and Persistence
- **Functionality**: Postcode lookup with address selection that persists across sessions
- **Purpose**: Eliminates repetitive data entry and personalizes the experience for returning residents
- **Trigger**: First-time visitor or Settings page access
- **Progression**: Enter postcode → View matching addresses → Select specific property → Address stored locally → All collection data personalized to that address
- **Success criteria**: Address persists across browser sessions; user can update from Settings; collection dates display correctly for selected property

### Collection Schedule Dashboard
- **Functionality**: Real-time view of upcoming bin collection dates by waste type
- **Purpose**: Primary use case - residents need to know which bins to put out and when
- **Trigger**: App launch (home screen)
- **Progression**: View dashboard → See next 2-3 collection dates per bin type → Note any bank holiday changes → Optional calendar integration
- **Success criteria**: Dates calculate correctly from stored day-of-week data; bank holidays adjust schedules appropriately; visual distinction between waste types is clear

### Waste Item Lookup
- **Functionality**: Searchable database of household items with disposal guidance
- **Purpose**: Reduces contamination by helping residents sort items correctly
- **Trigger**: User navigates to "What goes in which bin?" or searches from home
- **Progression**: Type item name → See filtered results → Select item → View bin type and disposal notes → Understand what to do with the item
- **Success criteria**: Search matches partial strings; results appear instantly; bin type is visually coded; special disposal notes (e.g., "flatten cardboard") are clear

### Recycling Centre Directory
- **Functionality**: List and map view of household waste recycling centres with opening hours and directions
- **Purpose**: Helps residents dispose of items that can't go in kerbside bins
- **Trigger**: User navigates to "Recycling centres" or follows link from waste item lookup
- **Progression**: View list/map of centres → Select nearest or most convenient → See opening hours and accepted materials → Tap for native map directions
- **Success criteria**: Centres display with current opening hours; map integration launches native app; distance/proximity is clear

### Service Alerts Feed
- **Functionality**: Time-bound notifications of collection delays, holiday schedules, and service changes
- **Purpose**: Keeps residents informed of exceptions to normal service
- **Trigger**: Automatic display on home screen when alerts affect user's postcode
- **Progression**: Alert created by admin → Filtered by affected postcodes and active dates → Displayed prominently on home → Dismissible but re-appears until end date
- **Success criteria**: Only active alerts show; postcode filtering works correctly; alerts are visually distinct from regular content

### Issue Reporting
- **Functionality**: Submit reports of missed collections, fly-tipping, or other street issues with photos and location
- **Purpose**: Provides residents a clear channel to report problems (demonstration feature, not integrated with council CRM)
- **Trigger**: User navigates to "Report an issue"
- **Progression**: Select issue type → Add description → Optionally attach photo → Optionally share location → Submit → Receive confirmation reference number
- **Success criteria**: Form validates required fields; photo upload works; geolocation captures coordinates; report is stored with timestamp

### Admin Alert Management
- **Functionality**: Simple admin interface to create, edit, and deactivate service alerts
- **Purpose**: Enables council staff to communicate service disruptions without developer intervention
- **Trigger**: Admin navigates to dedicated admin page
- **Progression**: View existing alerts → Create new alert → Set title, message, affected postcodes, date range → Save → Alert appears to matching residents
- **Success criteria**: Date range validation prevents invalid alerts; postcode targeting works; expired alerts auto-hide

## Edge Case Handling

- **No address selected**: Show persistent prompt to enter postcode with clear CTA; disable collection-specific features until address is set
- **Invalid postcode**: Display friendly error message with format example (PE30 1XX); offer to clear input
- **No matching addresses**: Explain no properties found and suggest checking the postcode or contacting council
- **Bank holiday calculations**: Hard-code major UK bank holidays through 2025; adjust collection dates forward (never backward) when they fall on collection day
- **Empty search results**: "We couldn't find [item] - try a different word or contact the council" with helpful suggestions
- **Offline state**: Display cached collection dates and waste items; show friendly message if trying to access network-dependent features
- **Stale data**: Include "Last updated" timestamps on critical data; provide admin refresh mechanism
- **Photo upload failures**: Validate file size (<5MB) and type (images only); show progress indicator; allow retry
- **Location permission denied**: Report form works without location; show note that location helps council respond faster

## Design Direction

The design should evoke the trustworthy, accessible clarity of the GOV.UK Design System while remaining warm and approachable for everyday civic service. A minimal interface serves the core purpose best - residents need answers quickly, not rich visual experiences. Clear typography, generous whitespace, and strong information hierarchy ensure usability across all ages and abilities. The design should feel institutional enough to communicate authority but friendly enough for daily use.

## Color Selection

Complementary palette based on GOV.UK Design System standards, using official government service colours to ensure accessibility and familiarity.

- **Primary Color**: Dark Blue (#1d70b8 / oklch(0.52 0.11 254)) - Official GOV.UK link blue, communicating trust and action on primary CTAs and interactive elements
- **Secondary Colors**: 
  - Dark Grey (#0b0c0c / oklch(0.13 0 0)) for body text, ensuring maximum readability
  - Light Grey (#f3f2f1 / oklch(0.96 0.002 60)) for backgrounds and panels
  - Mid Grey (#505a5f / oklch(0.40 0.009 240)) for secondary text and borders
- **Accent Color**: Success Green (#00703c / oklch(0.45 0.13 163)) for confirmation states, collection dates, and positive actions
- **Destructive**: Error Red (#d4351c / oklch(0.58 0.20 32)) for errors, alerts, and urgent warnings

**Foreground/Background Pairings**:
- Background (White #ffffff): Dark Grey text (#0b0c0c) - Ratio 18.4:1 ✓
- Card (Light Grey #f3f2f1): Dark Grey text (#0b0c0c) - Ratio 16.8:1 ✓
- Primary (Dark Blue #1d70b8): White text (#ffffff) - Ratio 4.6:1 ✓
- Secondary (Mid Grey #505a5f): White text (#ffffff) - Ratio 7.2:1 ✓
- Accent (Success Green #00703c): White text (#ffffff) - Ratio 5.1:1 ✓
- Muted (Light Grey #f3f2f1): Mid Grey text (#505a5f) - Ratio 6.5:1 ✓

## Font Selection

Typography should communicate civic authority and absolute clarity, prioritizing readability for all ages and abilities over personality or brand expression. The GOV.UK Transport font family is unavailable, so we'll use the GDS fallback recommendation of system sans-serif stack with emphasis on legibility.

**Typeface**: Inter (geometric sans-serif with excellent legibility at all sizes, optimized for screens, open-source alternative to GOV.UK Transport)

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold / 36px / -0.5px letter spacing / 1.1 line height
  - H2 (Section Heading): Inter SemiBold / 24px / -0.25px letter spacing / 1.2 line height
  - H3 (Subsection): Inter SemiBold / 19px / normal letter spacing / 1.3 line height
  - Body Text: Inter Regular / 19px / normal letter spacing / 1.5 line height
  - Body Small: Inter Regular / 16px / normal letter spacing / 1.5 line height
  - Label/Caption: Inter Medium / 16px / normal letter spacing / 1.4 line height
  - Large Numbers (collection dates): Inter Bold / 48px / tight letter spacing / 1.0 line height

## Animations

Animations should be barely perceptible, serving only to maintain context during state changes and guide attention to updated information without delaying task completion or drawing attention to the interface itself.

- **Purposeful Meaning**: Micro-transitions (100-200ms) on interactive elements communicate responsiveness; collection date cards fade in to suggest freshness of data; alert banners slide down smoothly to avoid jarring interruptions
- **Hierarchy of Movement**: Collection dates receive subtle scale emphasis on load (most important); form validation feedback is immediate and direct; page transitions are minimal crossfades that preserve scroll position

## Component Selection

- **Components**: 
  - Card for collection schedule items, waste items, and recycling centres
  - Input with Label for postcode entry and search fields
  - Button (primary variant for "Find my address", secondary for "Update address")
  - Select for address dropdown from postcode results
  - Alert for service disruption banners (destructive variant for urgent, default for informational)
  - Dialog for issue reporting form
  - Badge to indicate bin types (general waste, recycling, garden, food)
  - Calendar for date display where appropriate
  - Tabs for switching between list/map view of recycling centres
  - Textarea for issue descriptions
  - Form components for structured data entry
  - Separator for visual section breaks
  
- **Customizations**: 
  - Custom bin-type badge component with color coding (black for general waste, blue for recycling, green for garden, brown for food)
  - Custom collection date card with large date display and bin icon
  - Custom map integration component wrapping native map links
  - Custom postcode input with format validation and auto-capitalization
  
- **States**: 
  - Buttons: Default with strong border, hover with slight background darken, active with inset shadow, focus with thick yellow outline (#ffdd00), disabled with reduced opacity
  - Inputs: Default with mid-grey border, focus with thick blue border and yellow outline, error with red border and error icon, success with green checkmark
  - Cards: Default with subtle shadow, hover with slight lift (2px translate), selected with blue left border
  
- **Icon Selection**: 
  - Phosphor icons throughout: Trash for general waste, Recycle for recycling, Plant for garden waste, Apple for food waste, MapPin for locations, Calendar for dates, MagnifyingGlass for search, Warning for alerts, Camera for photo upload, NavigationArrow for directions
  
- **Spacing**: 
  - Base unit: 4px
  - Component padding: 16px (forms, cards), 24px (page containers)
  - Stack spacing: 8px (tight groups), 16px (related sections), 24px (page sections), 32px (major sections)
  - Grid gap: 16px (mobile), 24px (tablet+)
  
- **Mobile**: 
  - Single column layout on mobile (<768px) with full-width cards
  - Bottom sheet navigation for main sections rather than sidebar
  - Sticky header with postcode display and "Change" link
  - Collection date cards stack vertically with larger touch targets (min 44px height)
  - Search inputs become full-width with larger text (19px)
  - Map view becomes full-screen modal on mobile
  - Form inputs stack vertically with generous spacing (16px between fields)
