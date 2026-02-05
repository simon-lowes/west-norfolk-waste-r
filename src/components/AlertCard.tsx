import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, PanResponder, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ServiceAlert, AlertSeverity } from '../types';
import { useTheme } from '../theme';
import { Card } from './Card';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react-native';
import { createSwipeDismissAnimation } from '../utils';

interface AlertCardProps {
  alert: ServiceAlert;
  onDismiss?: () => void;
  compact?: boolean;
}

const SWIPE_THRESHOLD = 120;

export function AlertCard({ alert, onDismiss, compact = false }: AlertCardProps) {
  const { colors, layout } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const { reset, dismiss } = createSwipeDismissAnimation(translateX, opacity);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!onDismiss,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return !!onDismiss && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow swiping right
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
          // Fade out as user swipes
          opacity.setValue(1 - gestureState.dx / 300);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Trigger haptic and dismiss
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          dismiss(onDismiss);
        } else {
          // Snap back
          reset();
        }
      },
    })
  ).current;

  const getAlertColor = () => {
    switch (alert.severity) {
      case AlertSeverity.URGENT:
        return colors.alertUrgent;
      case AlertSeverity.WARNING:
        return colors.alertWarning;
      case AlertSeverity.INFO:
        return colors.alertInfo;
    }
  };

  const getIcon = () => {
    const iconProps = { size: compact ? 18 : 22, color: getAlertColor(), strokeWidth: 2 };
    switch (alert.severity) {
      case AlertSeverity.URGENT:
        return <AlertTriangle {...iconProps} />;
      case AlertSeverity.WARNING:
        return <AlertCircle {...iconProps} />;
      case AlertSeverity.INFO:
        return <Info {...iconProps} />;
    }
  };

  const alertColor = getAlertColor();

  const cardStyle = compact
    ? { ...styles.card, ...styles.cardCompact, borderLeftColor: alertColor, borderLeftWidth: 4 }
    : { ...styles.card, borderLeftColor: alertColor, borderLeftWidth: 4 };

  const handleDismissPress = () => {
    if (onDismiss) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      dismiss(onDismiss);
    }
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [{ translateX }],
        opacity,
      }}
    >
      <Card style={cardStyle} hapticFeedback={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>{getIcon()}</View>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              compact && styles.titleCompact,
            ]}
            numberOfLines={compact ? 1 : 2}
          >
            {alert.title}
          </Text>
          {onDismiss && (
            <Pressable
              onPress={handleDismissPress}
              style={[styles.dismissButton, { backgroundColor: colors.surfaceSecondary }]}
              hitSlop={8}
            >
              <X size={16} color={colors.textSecondary} strokeWidth={2} />
            </Pressable>
          )}
        </View>

        {!compact && (
          <Text
            style={[styles.message, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {alert.message}
          </Text>
        )}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardCompact: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  titleCompact: {
    fontSize: 14,
  },
  dismissButton: {
    padding: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});
