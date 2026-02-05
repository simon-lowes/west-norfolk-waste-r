// Animation utilities for delightful micro-interactions
import { Animated, Platform } from 'react-native';

// Spring configurations for different animation feels
export const springConfigs = {
  // Snappy spring for button presses
  snappy: {
    tension: 300,
    friction: 20,
    useNativeDriver: true,
  },
  // Gentle spring for subtle movements
  gentle: {
    tension: 150,
    friction: 15,
    useNativeDriver: true,
  },
  // Bouncy spring for playful animations
  bouncy: {
    tension: 200,
    friction: 12,
    useNativeDriver: true,
  },
} as const;

/**
 * Creates a press animation that scales an element
 * @param scaleValue - Animated.Value to control scale
 * @param toValue - Scale value when pressed (default 0.96)
 * @returns Object with onPressIn and onPressOut handlers
 */
export function createPressAnimation(
  scaleValue: Animated.Value,
  toValue: number = 0.96
) {
  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue,
      ...springConfigs.snappy,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      ...springConfigs.snappy,
    }).start();
  };

  return { onPressIn, onPressOut };
}

/**
 * Creates a looping pulse animation for urgency indicators
 * @param scaleValue - Animated.Value to control scale
 * @param minScale - Minimum scale (default 0.98)
 * @param maxScale - Maximum scale (default 1.02)
 * @returns Animation object and stop function
 */
export function createPulseAnimation(
  scaleValue: Animated.Value,
  minScale: number = 0.98,
  maxScale: number = 1.02
) {
  let animation: Animated.CompositeAnimation | null = null;
  let isStopped = false;

  const start = () => {
    isStopped = false;
    const pulse = () => {
      if (isStopped) return;
      animation = Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: maxScale,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: minScale,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
      animation.start(() => {
        if (!isStopped) pulse();
      });
    };
    pulse();
  };

  const stop = () => {
    isStopped = true;
    if (animation) {
      animation.stop();
    }
    // Reset to normal scale
    scaleValue.setValue(1);
  };

  return { start, stop };
}

/**
 * Creates a staggered entrance animation for list items
 * @param opacity - Animated.Value for opacity
 * @param translateY - Animated.Value for vertical position
 * @param delay - Delay before animation starts (ms)
 */
export function createEntranceAnimation(
  opacity: Animated.Value,
  translateY: Animated.Value,
  delay: number = 0
) {
  // Start hidden
  opacity.setValue(0);
  translateY.setValue(20);

  const start = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        ...springConfigs.gentle,
      }),
    ]).start();
  };

  return { start };
}

/**
 * Creates a swipe-to-dismiss animation
 * @param translateX - Animated.Value for horizontal position
 * @param opacity - Animated.Value for opacity
 * @returns Handlers for gesture response and dismiss action
 */
export function createSwipeDismissAnimation(
  translateX: Animated.Value,
  opacity: Animated.Value
) {
  const reset = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        ...springConfigs.snappy,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const dismiss = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  };

  return { reset, dismiss };
}

/**
 * Creates a bounce animation for tab icons
 * @param scaleValue - Animated.Value to control scale
 */
export function createBounceAnimation(scaleValue: Animated.Value) {
  const bounce = () => {
    scaleValue.setValue(0.8);
    Animated.spring(scaleValue, {
      toValue: 1,
      ...springConfigs.bouncy,
    }).start();
  };

  return { bounce };
}

/**
 * Triggers haptic feedback if available
 * Imported from expo-haptics in components that use it
 */
export const hapticIntensity = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;
