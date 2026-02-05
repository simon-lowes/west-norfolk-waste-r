# UK Council Bin Day Website Research Findings

**Research Date:** February 2026
**Purpose:** Document UI/UX patterns and features used by UK councils for bin day checkers
**Target Council:** West Norfolk (Borough Council of King's Lynn & West Norfolk)

---

## Executive Summary

After researching 10 UK council websites for their bin collection day features, several common patterns emerge:

### Key Findings

1. **Postcode-based lookup is universal** - All councils use postcode/address search as the primary entry point
2. **Third-party providers are common** - Many councils outsource bin day systems (Veolia, Jadu platform)
3. **Mobile apps are valued** - Several councils offer dedicated mobile apps with push notifications
4. **Calendar downloads are standard** - PDF calendar downloads are commonly available
5. **Service alerts are prominent** - Councils display disruption notices prominently
6. **Color-coded bins vary by council** - No national standard for bin colors

### Recommended Features to Adopt

1. Simple postcode search with autocomplete
2. Clear "next collection" display with countdown
3. Color-coded bin icons matching physical bins
4. Push notification reminders
5. Calendar download (PDF/iCal)
6. Service disruption alerts banner
7. "Report missed collection" quick link

---

## Council-by-Council Analysis

### 1. West Norfolk (Target Council)

**URL:** https://www.west-norfolk.gov.uk/info/20174/bins_and_recycling_collection_dates

**Platform:** Jadu Continuum (by SPACECRAFT Digital)

**Address Lookup:**
- Postcode or street name search
- Single text input field with "Search" button
- Must be within Borough of King's Lynn & West Norfolk

**Information Displayed:**
- Collection dates for all bins/bags at property
- Bank holiday adjustments reflected
- Brown bin service only shown if user has paid subscription

**Bin Types:**
- Standard bins/bags
- Recycling collections
- Brown bin (garden waste - paid service)

**Features:**
- MyNotifications feature for nearby services alerts
- Account sign-in/register option
- MyAccounts integration

**Visual Design:**
- Blue header with gold accents
- Clean, simple form layout
- Prominent breadcrumb navigation
- A-Z service directory in footer

**Standout Features:**
- "Find MyNearest" postcode search for local services
- Newsletter signup ("Your News")
- ReciteMe accessibility/translation tools

---

### 2. Bristol City Council

**URL:** https://www.bristol.gov.uk/residents/bins-and-recycling/bins-and-recycling-collection-dates

**Bin Checker URL:** https://waste.bristol.gov.uk

**Address Lookup:**
- Postcode-based search
- Multi-step process (Step 1: enter postcode, Step 2: select address)
- Validation with helpful error messages

**Bin Types:**
- Black wheelie bin (every 2 weeks)
- Black and green recycling boxes (weekly)
- Brown food waste bin (weekly)
- Garden waste (every 2 weeks - paid service)

**Features:**
- "Bin collection day finder" button prominently displayed
- PDF calendar downloads
- Briz digital assistant (AI chatbot)
- Christmas tree collection prominently mentioned seasonally

**Visual Design:**
- Modern, clean design
- Blue header
- Service cards with illustrations
- Strong use of icons

**Standout Features:**
- AI-powered Briz chatbot for 24/7 support
- "Tell us about a problem" feedback button
- Prominent seasonal messaging (Christmas tree collection)

---

### 3. Sheffield City Council

**URL:** https://www.sheffield.gov.uk/bins-waste-recycling
**Bin Checker URL:** https://wasteservices.sheffield.gov.uk/

**Platform:** Outsourced to Veolia

**Address Lookup:**
- Postcode or street name search
- "Find address" button
- Example format shown (eg S1 2SH)

**Bin Types:**
- Green bins (garden waste)
- Standard bins
- Bulky waste collection available

**Features:**
- "Services and collection dates" quick link
- "Bin collection service alerts" link (external Veolia site)
- Report missed bin collection
- Request replacement bin

**Visual Design:**
- Dark teal/navy header with purple accent imagery
- Pill-shaped action buttons with arrows
- Card-based layout for services
- Clean, modern typography

**Standout Features:**
- Real-time service alerts displayed prominently (strike action notice)
- Partnership branding with Veolia
- Dedicated links to Veolia service pages

---

### 4. Leeds City Council

**URL:** https://www.leeds.gov.uk/bins-and-recycling/check-your-bin-day

**Address Lookup:**
- Postcode entry with example format shown
- "Look up Address" button
- Form ID tracking visible

**Bin Types:**
- Brown bin (garden waste - seasonal, paused in winter)
- Standard bins
- Recycling bins

**Features:**
- **Dedicated mobile app** (Leeds Bins) available on:
  - Google Play Store
  - Apple App Store
- In-app reminders for bin days
- Service alerts displayed as dismissible banners
- Feedback integration

**Visual Design:**
- Orange alert banners for important notices
- Blue/navy header
- Card-based form design
- Social media links (X, Instagram, Facebook)

**Standout Features:**
- **Native mobile app with push notifications** - key differentiator
- Seasonal service messaging (brown bin winter pause)
- Composting tips and guidance links

---

### 5. Birmingham City Council

**URL:** https://www.birmingham.gov.uk/info/20009/bins_and_recycling

**Platform:** Jadu (same platform as West Norfolk)

**Address Lookup:**
- "Check your collection day" as primary action
- Postcode-based search

**Features:**
- AI chatbot ("Brum Bot")
- Service disruption alerts banner
- Multiple related services grouped
- Newsletter signup
- Account management (Sign in / Register)

**Visual Design:**
- Purple header
- **Colorful service cards with icons:**
  - Yellow card: Industrial action
  - Blue card: Check your collection day
  - Green card: Report a missed collection
  - Grey card: Household recycling centres
  - Teal card: Bulky waste collection
  - Yellow card: About your recycling and rubbish bins
- Icons use consistent illustrative style

**Standout Features:**
- AI chatbot integration
- Visually engaging service cards with distinct colors
- Industrial action alerts prominently displayed
- Strong visual hierarchy

---

### 6. Manchester City Council

**URL:** https://www.manchester.gov.uk/bincollections
**Redirects to:** Verint cloud services portal

**Platform:** External Verint portal with ArcGIS integration

**Address Lookup:**
- Postcode-based search
- Uses ArcGIS API for location services

**Features:**
- External portal hosted system
- Knowledge base search
- Chat widget available

**Notes:**
- Heavy reliance on external service provider
- Technical infrastructure rather than user-facing council website

---

### 7. Westminster City Council

**URL:** https://www.westminster.gov.uk/recycling-and-rubbish

**Status:** Online waste schedules currently unavailable due to technical disruptions

**Bin Types:**
- Blue bins (mixed recycling) - NEW
- Black bins (rubbish)
- Food waste recycling (separate category)

**Notes:**
- Recently transitioned to new bin system
- Service disruptions affecting online tools

---

### 8. Royal Borough of Kensington and Chelsea

**Status:** Cyber-security incident (November 2024) affecting services

**Notes:**
- Council experienced significant cyber attack
- Some systems remain disrupted
- Unable to fully assess bin checker functionality

---

## Third-Party Apps & Services Discovered

### BinDays App (Independent)

**App Store:** Available on iOS and Android
**Rating:** 4.8/5 (88 ratings)
**Developer:** Andrew Riggs
**Website:** https://bindays.app

**Features:**
- Automatic collection schedules
- Customizable notifications
- Multiple reminders
- Supports various UK council collectors
- Background data refresh
- Dark mode
- Open source (GitHub available)

**Key Proposition:** "Never miss a bin day again"

**Similar Apps Found:**
- Leeds Bins (official council app)
- SCAMBS Bin Collections
- MyBinApp
- SAC MyBins
- Bin Day Alert
- BinColCal
- MyBins

---

## Common UI/UX Patterns Observed

### Address Lookup

| Pattern | Councils Using |
|---------|----------------|
| Postcode search only | Most councils |
| Postcode + street name | West Norfolk, Sheffield |
| Two-step process | Bristol |
| Example format shown | Sheffield, Leeds |

### Collection Information Display

| Feature | Frequency |
|---------|-----------|
| Next collection date | Universal |
| Collection frequency noted | Common |
| Bank holiday adjustments | Common |
| Service alerts | Common |
| Calendar downloads | Common |

### Bin Color Schemes (by council)

| Council | Recycling | General Waste | Food Waste | Garden Waste |
|---------|-----------|---------------|------------|--------------|
| Bristol | Black/Green boxes | Black wheelie | Brown | Green |
| Westminster | Blue | Black | - | - |
| Leeds | - | - | - | Brown |
| Sheffield | - | - | - | Green |

*Note: Colors vary significantly by council - no national standard*

### Navigation Patterns

| Pattern | Description |
|---------|-------------|
| Service cards | Color-coded cards with icons (Birmingham) |
| Quick links | Pill/button style links (Sheffield) |
| List format | Simple text links (West Norfolk, Leeds) |
| Sidebar related | Related information in sidebar (Birmingham) |

---

## Technology Stack Observations

### Platforms Identified

1. **Jadu Continuum** - West Norfolk, Birmingham
2. **Veolia Systems** - Sheffield (outsourced waste services)
3. **Verint Cloud Services** - Manchester
4. **Custom builds** - Bristol, Leeds

### External APIs/Services

- ArcGIS location services (Manchester)
- Royal Mail postcode finder integration (Bristol)
- Google Tag Manager (most sites)
- SiteImprove analytics (several councils)

### Accessibility Features

- ReciteMe accessibility tools (West Norfolk)
- Skip to content links (universal)
- Screen reader compatible forms (most)
- Translation options (several)

---

## Recommendations for West Norfolk Waste-R App

### Must-Have Features

1. **Simple postcode lookup** with autocomplete
2. **Clear next collection display** with countdown ("2 days until collection")
3. **Color-coded bin icons** matching West Norfolk's actual bin colors
4. **Push notifications** - configurable reminders (day before, morning of)
5. **Calendar export** - iCal format for personal calendars
6. **Service alerts banner** - prominent display for disruptions

### Should-Have Features

1. **Multiple address support** - for users with multiple properties
2. **Dark mode** - popular in modern apps
3. **Offline support** - cache collection schedule locally
4. **Widget support** - iOS/Android home screen widgets
5. **Bank holiday adjustments** shown automatically

### Nice-to-Have Features

1. **AI chatbot** for common questions
2. **Report missed collection** quick action
3. **What goes in which bin** reference guide
4. **Recycling tips** educational content
5. **Nearby recycling centres** map integration

### UI/UX Guidelines

1. Use clear, simple language
2. Minimize steps to find collection date (1-2 taps ideal)
3. Show visual bin icons users can relate to
4. Use consistent color scheme matching council branding (blue/gold)
5. Ensure WCAG 2.1 AA accessibility compliance
6. Test with screen readers
7. Support both portrait and landscape orientations

---

## Screenshots Reference

Screenshots captured during research are available in:
`/Users/simonlowes/Library/Mobile Documents/com~apple~CloudDocs/Coding/Bins_app/west-norfolk-waste-r/research/screenshots/`

| Filename | Description |
|----------|-------------|
| west-norfolk-bin-search.png | West Norfolk bin collection search page |
| sheffield-homepage.png | Sheffield Council homepage |
| sheffield-bins-page.png | Sheffield bins service page |
| sheffield-bin-checker.png | Sheffield Veolia bin checker |
| leeds-bin-checker.png | Leeds bin day checker |
| birmingham-bins-page.png | Birmingham waste services page |

---

## Conclusion

UK council bin day checkers share common patterns but vary in sophistication. The most user-friendly implementations offer:

1. **Speed** - Quick postcode lookup with immediate results
2. **Clarity** - Clear visual indication of next collection
3. **Convenience** - Mobile apps with push notifications
4. **Flexibility** - Calendar downloads for personal scheduling

For the West Norfolk Waste-R app, focusing on speed and convenience while matching the council's existing service data will provide the most value to residents.
