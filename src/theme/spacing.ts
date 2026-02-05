// West Norfolk Waste - Spacing System
// 4px base unit, generous whitespace for clean design

export const spacing = {
  // Base spacing scale (4px increments)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

export const layout = {
  // Container padding
  screenPadding: 16,
  cardPadding: 16,
  sectionPadding: 24,

  // Border radius
  radiusSmall: 6,
  radiusMedium: 8,
  radiusLarge: 12,
  radiusXLarge: 16,
  radiusFull: 9999,

  // Shadow - Enhanced for visual hierarchy
  shadowSmall: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  shadowMedium: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowLarge: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  // Hero shadow for prominent cards
  shadowHero: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },

  // Tab bar
  tabBarHeight: 80,
  tabBarPadding: 8,

  // Header
  headerHeight: 56,
};

export type Spacing = typeof spacing;
export type Layout = typeof layout;
