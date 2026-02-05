import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme, ThemePreference } from '../theme';
import { Sun, Moon, Smartphone } from 'lucide-react-native';

interface ThemeToggleProps {
  showLabel?: boolean;
}

const THEME_OPTIONS: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
  { value: 'system', icon: Smartphone, label: 'Auto' },
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
];

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { colors, layout, preference, setThemePreference } = useTheme();

  const handlePress = (newPreference: ThemePreference) => {
    if (newPreference !== preference) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setThemePreference(newPreference);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSecondary,
          borderRadius: layout.radiusMedium,
        },
      ]}
    >
      {THEME_OPTIONS.map(({ value, icon: Icon, label }) => {
        const isSelected = preference === value;
        return (
          <Pressable
            key={value}
            onPress={() => handlePress(value)}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? colors.surface : 'transparent',
                borderRadius: layout.radiusSmall,
              },
            ]}
          >
            <Icon
              size={16}
              color={isSelected ? colors.primary : colors.textTertiary}
              strokeWidth={2}
            />
            {showLabel && (
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? colors.primary : colors.textTertiary },
                ]}
              >
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
