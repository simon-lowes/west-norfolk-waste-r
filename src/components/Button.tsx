import React, { ReactNode, useRef } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import { createPressAnimation } from '../utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  hapticFeedback?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  hapticFeedback = true,
}: ButtonProps) {
  const { colors, layout } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const { onPressIn, onPressOut } = createPressAnimation(scaleValue, 0.96);

  const handlePress = () => {
    if (!disabled && !loading) {
      if (hapticFeedback && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          button: { paddingVertical: 8, paddingHorizontal: 16 },
          text: { fontSize: 13 },
        };
      case 'large':
        return {
          button: { paddingVertical: 16, paddingHorizontal: 24 },
          text: { fontSize: 17 },
        };
      default:
        return {
          button: { paddingVertical: 12, paddingHorizontal: 20 },
          text: { fontSize: 15 },
        };
    }
  };

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.surfaceSecondary,
            borderWidth: 0,
          },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border,
          },
          text: { color: colors.text },
        };
      case 'ghost':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: colors.primary },
        };
      default:
        return {
          button: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          { borderRadius: layout.radiusMedium },
          sizeStyles.button,
          variantStyles.button,
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : colors.primary}
          />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                sizeStyles.text,
                variantStyles.text,
                icon ? styles.textWithIcon : undefined,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  textWithIcon: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
