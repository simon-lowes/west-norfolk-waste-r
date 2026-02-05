// West Norfolk Waste - Color Theme
// Modern clean utility design inspired by Stripe/Linear

export const lightColors = {
  // Base
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',

  // Text
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

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

  // Actions
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  success: '#16A34A',
  error: '#DC2626',

  // Shadows
  shadowColor: '#000000',
};

export const darkColors = {
  // Base
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceSecondary: '#262626',

  // Text
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',

  // Borders
  border: '#3F3F46',
  borderLight: '#27272A',

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

  // Actions
  primary: '#60A5FA',
  primaryHover: '#3B82F6',
  success: '#4ADE80',
  error: '#F87171',

  // Shadows
  shadowColor: '#000000',
};

export type ColorTheme = typeof lightColors;
