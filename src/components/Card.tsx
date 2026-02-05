import React, { ReactNode, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import { createPressAnimation } from '../utils';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  hapticFeedback?: boolean;
}

export function Card({ children, style, onPress, variant = 'default', hapticFeedback = true }: CardProps) {
  const { colors, layout, isDark } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const { onPressIn, onPressOut } = createPressAnimation(scaleValue, 0.97);

  const handlePressIn = () => {
    if (onPress) {
      onPressIn();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      onPressOut();
    }
  };

  const handlePress = () => {
    if (onPress) {
      if (hapticFeedback && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...(isDark
            ? { borderWidth: 1, borderColor: colors.border }
            : layout.shadowMedium),
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.surface,
          ...(isDark
            ? { borderWidth: 1, borderColor: colors.borderLight }
            : layout.shadowSmall),
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: layout.radiusLarge,
    padding: layout.cardPadding,
    ...getVariantStyles(),
  };

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[cardStyle, style]}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({});
