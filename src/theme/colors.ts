// West Norfolk Waste - Color Theme
// Warm, inviting design that feels delightful to use

export const lightColors = {
  // Base - Warm cream instead of cold gray
  background: '#FFF9F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#FEF6F0',

  // Text - Stone tones for warmth
  text: '#292524',        // Stone-800 - softer than pure black
  textSecondary: '#78716C', // Stone-500
  textTertiary: '#A8A29E', // Stone-400

  // Borders
  border: '#E7E5E4',      // Stone-200
  borderLight: '#F5F5F4', // Stone-100

  // Bin Colors - Main accent colors for waste types
  rubbish: '#374151',      // Gray-700 - General waste
  recycling: '#2563EB',    // Blue-600 - Recycling
  garden: '#16A34A',       // Green-600 - Garden waste
  food: '#CA8A04',         // Yellow-600 - Food waste
  centre: '#7C3AED',       // Violet-600 - Recycling centre only

  // Alert Severities
  alertUrgent: '#DC2626',  // Red-600
  alertWarning: '#F59E0B', // Amber-500
  alertInfo: '#3B82F6',    // Blue-500

  // Actions - Warm orange as primary for energy
  primary: '#F97316',      // Orange-500 - warm and inviting
  primaryHover: '#EA580C', // Orange-600
  success: '#16A34A',
  error: '#DC2626',

  // Accent colors
  accent: '#F97316',       // Same as primary for consistency
  accentSoft: '#FFEDD5',   // Orange-100 - subtle highlight backgrounds

  // Shadows
  shadowColor: '#000000',
};

export const darkColors = {
  // Base - Warmer dark tones
  background: '#1C1917',   // Stone-900
  surface: '#292524',      // Stone-800
  surfaceSecondary: '#3C3836',

  // Text
  text: '#FAFAF9',         // Stone-50
  textSecondary: '#A8A29E', // Stone-400
  textTertiary: '#78716C', // Stone-500

  // Borders
  border: '#44403C',       // Stone-700
  borderLight: '#3C3836',

  // Bin Colors - Brighter for dark mode
  rubbish: '#9CA3AF',      // Gray-400
  recycling: '#60A5FA',    // Blue-400
  garden: '#4ADE80',       // Green-400
  food: '#FACC15',         // Yellow-400
  centre: '#A78BFA',       // Violet-400

  // Alert Severities
  alertUrgent: '#F87171',  // Red-400
  alertWarning: '#FBBF24', // Amber-400
  alertInfo: '#60A5FA',    // Blue-400

  // Actions - Warm orange in dark mode too
  primary: '#FB923C',      // Orange-400 - warm for dark mode
  primaryHover: '#F97316', // Orange-500
  success: '#4ADE80',
  error: '#F87171',

  // Accent colors
  accent: '#FB923C',       // Orange-400
  accentSoft: '#431407',   // Orange-950 - dark subtle highlight

  // Shadows
  shadowColor: '#000000',
};

export type ColorTheme = typeof lightColors;
