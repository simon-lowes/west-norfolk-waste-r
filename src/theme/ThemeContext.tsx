import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorTheme } from './colors';
import { typography, Typography } from './typography';
import { spacing, layout, Spacing, Layout } from './spacing';

const THEME_STORAGE_KEY = '@west_norfolk_waste_theme';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  preference: ThemePreference;
  colors: ColorTheme;
  typography: Typography;
  spacing: Spacing;
  layout: Layout;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate effective mode based on preference and system scheme
  const getEffectiveMode = (pref: ThemePreference, systemScheme: typeof systemColorScheme): ThemeMode => {
    if (pref === 'system') {
      // useColorScheme() returns the device's color scheme
      // Falls back to light only if truly null (shouldn't happen on modern devices)
      return systemScheme ?? 'light';
    }
    return pref;
  };

  const mode = getEffectiveMode(preference, systemColorScheme);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        // Only load if it's explicitly 'system' - treat old 'light'/'dark' as legacy
        // that should be migrated to system-following behavior
        if (savedPreference === 'system') {
          setPreferenceState('system');
        } else if (savedPreference === 'light' || savedPreference === 'dark') {
          // Legacy preference - keep it but user can switch to 'system' to follow device
          setPreferenceState(savedPreference);
        }
        // If no saved preference, default to 'system' (already set)
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Listen for system theme changes (only affects UI when preference is 'system')
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Force re-render when system theme changes
      // This is handled automatically by useColorScheme(), but we keep the listener
      // for any additional side effects if needed in the future
    });
    return () => subscription.remove();
  }, []);

  // Set theme preference and save to storage
  const setThemePreference = async (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Legacy toggle for backwards compatibility - cycles through preferences
  const toggleTheme = async () => {
    // Simple toggle between light and dark (not system)
    const newMode = mode === 'light' ? 'dark' : 'light';
    await setThemePreference(newMode);
  };

  const value: ThemeContextType = {
    mode,
    preference,
    colors: mode === 'light' ? lightColors : darkColors,
    typography,
    spacing,
    layout,
    setThemePreference,
    toggleTheme,
    isDark: mode === 'dark',
  };

  // Show nothing until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
