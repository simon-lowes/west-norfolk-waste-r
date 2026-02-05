import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme';
import { Sun, Moon } from 'lucide-react-native';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = true }: ThemeToggleProps) {
  const { colors, layout, isDark, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSecondary,
          borderRadius: layout.radiusMedium,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? colors.surface : 'transparent',
            borderRadius: layout.radiusSmall,
          },
        ]}
      >
        <Moon
          size={18}
          color={isDark ? colors.primary : colors.textTertiary}
          strokeWidth={2}
        />
      </View>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: !isDark ? colors.surface : 'transparent',
            borderRadius: layout.radiusSmall,
          },
        ]}
      >
        <Sun
          size={18}
          color={!isDark ? colors.primary : colors.textTertiary}
          strokeWidth={2}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {isDark ? 'Dark' : 'Light'}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  iconContainer: {
    padding: 8,
  },
  label: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
