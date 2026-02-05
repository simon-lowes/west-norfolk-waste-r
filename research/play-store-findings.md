# UK Bin/Waste Apps - Google Play Store Research

**Research Date:** 5 February 2026
**Purpose:** Document UI/UX patterns, features, and user feedback from competing bin collection apps to inform West Norfolk Waste-r development

---

## Executive Summary

### Key Market Insights

1. **Fragmented Market:** The UK bin app market is dominated by council-specific apps (Leeds, Sheffield, Edinburgh, Dundee, etc.) rather than a unified national solution. BinDays stands out as attempting a multi-council approach.

2. **Open-Source Opportunity:** BinDays is open-source, suggesting transparency and community involvement can be a differentiator.

3. **Critical Pain Points (Opportunities for Us):**
   - **Unreliable notifications** - The #1 complaint across all apps
   - **Bank holiday collection date changes** - Users consistently mention this
   - **Poor address lookup** - Many users can't find their address
   - **Missing streets/postcodes** - Incomplete council data coverage
   - **Calendar sync failures** - "Add to calendar" features often break
   - **Spam notifications** - Council news/marketing mixed with reminders
   - **Unresponsive UI** - No loading states, unclear if app is working

4. **What Users Love:**
   - Simple, clear interfaces
   - Reliable day-before reminders
   - Customizable notification timing
   - "Which bin" clarity (colour-coded)
   - Working calendar integration
   - Multiple reminder options (morning + evening)

5. **UI Patterns:**
   - Green/teal colour schemes dominate
   - Bin icons with colour coding
   - Calendar views are standard
   - Postcode/address search as primary input
   - Simple, focused interfaces win (vs feature-bloated apps)

---

## App Comparison Table

| App Name | Developer | Rating | Reviews | Downloads | Key Differentiator |
|----------|-----------|--------|---------|-----------|-------------------|
| **BinDays** | BinDays | 4.1 | 63 | 1K+ | Multi-council UK, open-source |
| **Bin Reminder** | retfunsoft | 4.5 | 15 | 1K+ | Generic (no council data), manual setup |
| **Bin Day Sheffield** | James Charlesworth | 4.5 | 48 | 1K+ | Single city, very focused |
| **Our Streets - Basildon** | Basildon Council | 4.1 | 44 | 10K+ | Official council app, broad services |
| **Recycle Coach** | Recycle Coach | 3.4 | 16.6K | 100K+ | "What Goes Where" search, educational |
| **Leeds Bins** | imactivate | 3.7 | 227 | 50K+ | Interactive recycling point map |
| **Bin Days Edinburgh** | Code Storytelling | 3.9 | 8 | 500+ | Student project, community-maintained |
| **Bin-Ovation** | BIN-OVATION LTD | 1.8 | 342 | 50K+ | Heavy features but poor execution |
| **Dundee MyBins** | Albion Environmental Ltd | 4.2 | 142 | 5K+ | News/service updates from council |
| **LB Hounslow Waste Wizard** | London Borough of Hounslow | N/A | 0 | 100+ | "What goes where" focus |
| **NCL Bins** | Newcastle City Council | N/A | Few | - | Official council app |
| **Rotherham Bins** | imactivate | 4.2 | - | - | Same developer as Leeds |
| **Fenland Bins** | imactivate | 4.3 | - | - | Same developer as Leeds |

---

## Detailed App Analysis

### 1. BinDays (4.1 stars, 1K+ downloads)

**Developer:** BinDays (Open Source)
**Category:** Lifestyle
**Last Updated:** Jan 19, 2026

**Key Features:**
- Automatic collection schedules from council websites
- Customizable notifications
- Multiple reminders per collection
- Background data refresh
- Dark mode
- Open-source (GitHub available)

**Positive Reviews:**
- "Much more reliable than the now defunct binzone app"
- "Reminder is a game changer" - especially after bank holidays
- "Developer added my local council" - responsive to requests
- "Two reminders including which bin"

**Negative Reviews:**
- Limited council coverage (depends on developer adding councils)
- Some councils not supported

**UI Observations:**
- Green/teal colour scheme with white bin icon
- Clean, minimal interface
- Screenshot shows: postcode search, upcoming dates list, settings screens
- Feature labels in screenshots: "Easy Setup", "Custom Reminders", "Always Up-to-Date"

**Screenshot saved:** `bindays-app.png`

---

### 2. Bin Reminder (4.5 stars, 1K+ downloads)

**Developer:** retfunsoft
**Category:** House & Home
**Contains:** Ads

**Key Features:**
- Manual bin setup (not connected to council data)
- Notification or alarm options
- Multiple properties support
- Location-agnostic (works anywhere)

**Positive Reviews:**
- "Does exactly what it should"
- "Clear notifications, simple and easy to use"
- "Extra features if you need them"

**Negative Reviews:**
- "Not enough colours for bins" - grey bin not available
- "Would like both notification types" - day before AND morning
- Requires manual setup (no automatic schedule fetch)

**UI Observations:**
- Colorful bin icon (red, yellow, green bins)
- Blue accent color throughout app
- Screenshot shows property management, bin setup, reminder scheduling
- Multiple screens for detailed configuration

**Screenshot saved:** `bin-reminder-retfunsoft.png`

---

### 3. Bin Day Sheffield (4.5 stars, 1K+ downloads)

**Developer:** James Charlesworth
**Category:** House & Home
**Last Updated:** Sep 6, 2023

**Key Features:**
- Address lookup for Sheffield only
- Day-before reminder notifications
- Simple, focused functionality

**Positive Reviews:**
- "I'll never remember the colours, and will always lose the paper flyer"
- "My neighbours don't always put their bins out soon enough for me to copy"

**Negative Reviews:**
- "No longer sends notifications" - permissions issue
- "Can't turn them on in phone settings" - Android notification bug

**UI Observations:**
- Green bin icon
- Dark city background on launch
- Calendar view showing bin types by colour
- Very simple two-screen flow

**Screenshot saved:** `bin-day-sheffield.png`

---

### 4. Our Streets - Basildon (4.1 stars, 10K+ downloads)

**Developer:** Basildon Council (Official)
**Category:** House & Home
**Badge:** Government App

**Key Features:**
- Bin collection dates and reminders
- "How to dispose of" item search
- Service request reporting (bulky collection, graffiti, abandoned vehicles)
- One-Step Services ordering (pink sacks, etc.)

**Positive Reviews:**
- "Very useful around Bank Holidays"
- "Checking the correct bag is helpful"

**Negative Reviews:**
- "Stopped sending notifications" - reliability issue
- "Would like morning/afternoon notification option"
- "Search sometimes comes up blank"

**UI Observations:**
- Dark blue primary colour
- Video trailer available
- Mix of bin calendar and broader council services
- "Never miss bin day" and "Access online services" messaging

**Screenshot saved:** `our-streets-basildon.png`

---

### 5. Recycle Coach (3.4 stars, 100K+ downloads)

**Developer:** Recycle Coach
**Category:** Education
**Last Updated:** Jan 20, 2026

**Key Features:**
- Calendar and collection reminders
- "What Goes Where" material search engine
- Drop-off location finder with directions
- Report-a-problem (missed collections, broken bins)
- Weekly polls, quizzes, blog posts
- Educational recycling content

**Positive Reviews:**
- "Very useful to help you know what can be recycled"
- "Helpful to sort correctly so city doesn't waste time"

**Negative Reviews:**
- **"App can't find my address"** - major issue, affects many users
- "IT team won't investigate" - poor support
- "Single digit house addresses not found"
- "Responded saying it was my town's fault" - blame-shifting

**UI Observations:**
- Teal/cyan leaf logo
- Feature-rich with many screens
- Educational focus with tips and quizzes
- "Better recycling habits matter" tagline

**Screenshot saved:** `recycle-coach.png`

---

### 6. Leeds Bins (3.7 stars, 50K+ downloads)

**Developer:** imactivate
**Category:** Tools
**Last Updated:** May 8, 2025

**Key Features:**
- Black, Green, Brown bin dates for Leeds
- Calendar sync with device
- Interactive recycling points map
- Links to Leeds Council waste services

**Positive Reviews:**
- "Syncs with my Google calendar"
- "Updates every 6 weeks and asks if I want to add new dates"
- "Dead easy to use, incredibly practical"

**Negative Reviews:**
- **"Add to calendar worked first time then never since"** - common bug
- "Takes a few seconds to load" - perceived slowness
- "Shortcut to council page achieves same functionality"

**UI Observations:**
- Yellow/black bin icon
- Blue header bar
- Shows next collection prominently
- "Set Reminders" and "Add dates to calendar" buttons
- Map view for recycling points

**Screenshot saved:** `leeds-bins.png`

---

### 7. Bin Days Edinburgh Recycling (3.9 stars, 500+ downloads)

**Developer:** Code Storytelling (Student project)
**Category:** House & Home
**Last Updated:** Oct 20, 2025

**Key Features:**
- Street-based lookup (not postcode)
- Multiple bin types: packaging, glass, garden, food, landfill
- Combined calendar view
- Reminders

**Positive Reviews:**
- "Clear, simple, effective"
- "Simple yet brilliant"

**Negative Reviews:**
- **"Doesn't have one of the oldest street names"** - incomplete data
- **"Why does it not work by postcode?"** - user expectation mismatch

**Developer Response:** "Council website shows streets like 'Willowbrae Rd Odd numbers apart of 160-170' - not easy to go by postcode"

**UI Observations:**
- Colourful bin icon (green, blue, yellow, grey)
- Street selection dropdown
- Calendar with bin type filters
- "Become a Binfluencer on your street" - gamification messaging

**Screenshot saved:** `bin-days-edinburgh.png`

---

### 8. Bin-Ovation (1.8 stars, 50K+ downloads) - CAUTIONARY EXAMPLE

**Developer:** BIN-OVATION LTD
**Category:** Lifestyle
**Last Updated:** Jan 30, 2025

**Key Features (Advertised):**
- 250+ item database with photos
- A-Z search with brand name support
- Push notifications from council
- Recycling centre locations with GPS
- Tips for Reduce, Re-use, Recycle
- Quiz and sorting game

**Why It Fails (User Reviews):**

1. **Notification Reliability:**
   - "Reminders happen at wrong date and time"
   - "Often all bins in the same week" - logic errors
   - "Reminders go wrong again after correction"
   - "No reminder given at requested time"

2. **Spam Issues:**
   - "Started sending random news about the council"
   - "Annoying notifications that can't be disabled"
   - "Used to do exactly what you needed"

3. **Poor UX:**
   - "Unresponsive most of the time"
   - "No feedback when you click buttons"
   - "Never sure if app is doing anything"
   - "Clicks not registered"

4. **Bank Holiday Failures:**
   - "Notifications never right outside usual schedule"
   - "Weeks with bank holidays are wrong"

**UI Observations:**
- Green gradient background
- Feature-heavy grid of icons
- Busy, cluttered interface
- "Educational" content mixed with core functionality

**Screenshot saved:** `bin-ovation.png`

---

### 9. Dundee MyBins (4.2 stars, 5K+ downloads)

**Developer:** Albion Environmental Ltd
**Category:** Lifestyle
**Last Updated:** Jan 5, 2024

**Key Features:**
- Postcode search for Dundee area
- Personalized collection calendar
- Up to 2 alerts per collection at custom times
- Service updates and news from council
- Enquiry links to council forms

**Positive Reviews:**
- "Reminders sent at my requested time"
- "Remember to allow notifications on phone" - helpful tip

**Negative Reviews:**
- "It's just a calendar nothing else" - expectation of in-app services
- "Can't request bins or anything" - wants full service integration
- "Links to external websites are pointless"
- "No mention of glass recycling" - incomplete info
- "Heaps of restrictions with advice to attend recycling centres miles away"

**UI Observations:**
- Light green/teal bin icon
- Calendar grid view with coloured dots
- News/updates section prominent
- Clean, professional appearance

**Screenshot saved:** `dundee-mybins.png`

---

### 10. LB Hounslow Waste Wizard (No ratings yet, 100+ downloads)

**Developer:** London Borough of Hounslow (Official)
**Category:** Productivity
**Last Updated:** Jul 9, 2024

**Key Features:**
- Material search to learn disposal method
- "What goes where" focus
- Recycling, composting, or disposal guidance

**UI Observations:**
- Purple background with recycling arrow icon
- Search-first interface
- Dropdown search suggestions
- Location-based results

**Screenshot saved:** `hounslow-waste-wizard.png`

---

## Common UI Patterns Observed

### Colour Schemes
| App | Primary Colour | Icon Style |
|-----|---------------|------------|
| BinDays | Teal/Green | White bin silhouette |
| Bin Reminder | Blue/Grey | Colorful bins (red, yellow, green) |
| Sheffield | Green | Single green bin |
| Basildon | Dark Blue | Abstract swoop design |
| Recycle Coach | Teal/Cyan | Leaf/recycling shape |
| Leeds | Yellow/Black | Bin icon |
| Edinburgh | Multi-colour | 4 coloured bins |
| Bin-Ovation | Green gradient | "Bin-Ovation" text |
| Dundee | Light teal | Simple bin |
| Hounslow | Purple | Recycling arrow |

### Navigation Patterns
1. **Postcode/Address Entry First** - Most apps start with location input
2. **Calendar View** - Standard way to show upcoming collections
3. **Colour-coded Bin Types** - Visual differentiation is essential
4. **Settings/Reminders Secondary** - Accessed from menu/settings

### Information Architecture
1. **Next Collection** - Prominent on home screen
2. **Calendar/Schedule** - Full schedule view available
3. **Bin Types Legend** - What each colour means
4. **Reminder Settings** - Time and frequency options
5. **Contact/Links** - Council website and support

---

## Pain Points from Reviews (Opportunities for Us)

### Critical Issues to Avoid

| Issue | Frequency | Apps Affected | Our Solution |
|-------|-----------|---------------|--------------|
| **Unreliable notifications** | Very High | Bin-Ovation, Sheffield, Basildon | Robust notification system with redundancy |
| **Address not found** | High | Recycle Coach, Edinburgh | Comprehensive address database, manual fallback |
| **Bank holiday dates wrong** | High | Bin-Ovation, general | Council API integration with override capability |
| **Calendar sync broken** | Medium | Leeds | Test thoroughly, provide manual backup |
| **Spam notifications** | Medium | Bin-Ovation | Separate news from bin alerts |
| **No loading feedback** | Medium | Bin-Ovation | Clear loading states and progress indicators |
| **Missing bin colours** | Medium | Bin Reminder | Customizable bin colours |
| **Postcode vs street confusion** | Medium | Edinburgh | Support both lookup methods |

### Features Users Want

1. **Multiple reminder times** - "Day before AND morning"
2. **Customizable notification time** - Morning vs evening preference
3. **Calendar integration that works** - Google Calendar, Apple Calendar
4. **Offline access** - Schedule should work without internet
5. **Bank holiday intelligence** - Automatic date adjustments
6. **Simple, focused interface** - Don't bloat with unnecessary features
7. **Dark mode** - Mentioned as positive for BinDays
8. **Multiple properties** - For landlords or family members

---

## Recommendations for West Norfolk Waste-r

### Must-Have Features

1. **Reliable notification system** - This is the #1 reason apps fail
2. **Simple address/postcode lookup** - Fast, comprehensive, with manual fallback
3. **Clear "which bin" indicator** - Colour-coded, unmistakable
4. **Bank holiday handling** - Automatic adjustments with user notification
5. **Calendar export/sync** - ICS file or direct calendar integration
6. **Offline schedule access** - Cache collection dates locally

### Differentiators to Consider

1. **PWA approach** - No app store friction, instant updates
2. **Open data transparency** - Show where schedule data comes from
3. **Community feedback** - Easy way to report wrong dates
4. **Accessibility focus** - Many council apps fail here
5. **No spam** - Only bin-related notifications

### UI/UX Guidelines

1. **Green/teal colour palette** - Industry standard, suggests eco-friendliness
2. **Clear bin colour legend** - Make it impossible to confuse bins
3. **Loading states** - Always show feedback when fetching data
4. **Error messages** - Helpful, not technical
5. **Progressive disclosure** - Simple by default, details available

### What NOT to Do (Learned from Bin-Ovation)

1. Don't mix bin reminders with council news
2. Don't add features that bloat the core experience
3. Don't ignore user-reported bugs
4. Don't send notifications at wrong times
5. Don't require location data you don't need
6. Don't make UI unresponsive

---

## Screenshots Saved

All screenshots saved to `/Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/research/screenshots/`:

1. `bindays-app.png` - BinDays main view
2. `bin-reminder-retfunsoft.png` - Bin Reminder interface
3. `bin-day-sheffield.png` - Sheffield app with calendar
4. `our-streets-basildon.png` - Council app with video
5. `recycle-coach.png` - Feature-rich educational app
6. `leeds-bins.png` - Calendar and map features
7. `bin-days-edinburgh.png` - Student project UI
8. `bin-ovation.png` - Example of what NOT to do
9. `dundee-mybins.png` - Scottish council app
10. `hounslow-waste-wizard.png` - Material search focus
11. `search-bin-day-uk.png` - Play Store search results

---

## Key Takeaways

1. **The bar is low** - Most apps have significant problems. A well-executed simple app will stand out.

2. **Notifications are everything** - If your reminder doesn't work reliably, nothing else matters.

3. **Bank holidays cause chaos** - This is where most apps fail. Handle it well and you win.

4. **Users don't want features** - They want to know which bin to put out. That's it.

5. **Council-specific apps dominate** - But there's opportunity for a multi-council solution done right.

6. **Open-source builds trust** - BinDays' transparency is mentioned positively.

7. **Progressive Web Apps are underrepresented** - Most are native apps with app store friction.

---

*Research conducted by analyzing Google Play Store listings for UK bin collection and waste management apps.*
