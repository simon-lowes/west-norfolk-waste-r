// West Norfolk Waste - Typography
// Nunito for headlines (friendly, rounded), system fonts for body (performance)

// Whether fonts are loaded - set by App.tsx after font loading
let fontsLoaded = false;

export function setFontsLoaded(loaded: boolean) {
  fontsLoaded = loaded;
}

export function areFontsLoaded(): boolean {
  return fontsLoaded;
}

export const typography = {
  // Font families
  // Headlines use Nunito when loaded, body uses system fonts for performance
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    // Headline fonts (Nunito - friendly, rounded)
    headline: 'Nunito_700Bold',
    headlineFallback: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

export type Typography = typeof typography;
