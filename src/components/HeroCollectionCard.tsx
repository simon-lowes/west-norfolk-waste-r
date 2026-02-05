import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BinType, getBinTypeName, getBinColorKey } from '../types';
import { formatDate, createPulseAnimation, createPressAnimation } from '../utils';
import { useTheme } from '../theme';
import { Card } from './Card';
import { Trash2, Recycle, Leaf, UtensilsCrossed, Clock } from 'lucide-react-native';

interface HeroCollectionCardProps {
  binType: BinType;
  date: Date;
  daysUntil: number;
  onPress?: () => void;
}

export function HeroCollectionCard({ binType, date, daysUntil, onPress }: HeroCollectionCardProps) {
  const { colors, layout, isDark } = useTheme();
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef<ReturnType<typeof createPulseAnimation> | null>(null);

  // Set up pulse animation for urgent collections
  useEffect(() => {
    if (daysUntil <= 1) {
      pulseAnimation.current = createPulseAnimation(pulseScale, 0.98, 1.02);
      pulseAnimation.current.start();
    }

    return () => {
      if (pulseAnimation.current) {
        pulseAnimation.current.stop();
      }
    };
  }, [daysUntil, pulseScale]);

  const { onPressIn, onPressOut } = createPressAnimation(pressScale, 0.97);

  const handlePress = () => {
    if (onPress) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };
  const colorKey = getBinColorKey(binType);
  const binColor = colors[colorKey];
  const binName = getBinTypeName(binType);

  const getIcon = () => {
    const iconProps = { size: 48, color: '#FFFFFF', strokeWidth: 1.5 };
    switch (binType) {
      case BinType.GENERAL:
        return <Trash2 {...iconProps} />;
      case BinType.RECYCLING:
        return <Recycle {...iconProps} />;
      case BinType.GARDEN:
        return <Leaf {...iconProps} />;
      case BinType.FOOD:
        return <UtensilsCrossed {...iconProps} />;
      default:
        return <Trash2 {...iconProps} />;
    }
  };

  const getCountdownText = () => {
    if (daysUntil === 0) return 'Today - don\'t forget!';
    if (daysUntil === 1) return 'Tomorrow!';
    return `In ${daysUntil} days`;
  };

  const getUrgencyStyle = () => {
    if (daysUntil === 0) return { opacity: 1 };
    if (daysUntil === 1) return { opacity: 0.95 };
    return { opacity: 0.9 };
  };

  // Combine pulse and press animations
  const combinedScale = Animated.multiply(pulseScale, pressScale);

  return (
    <Animated.View style={{ transform: [{ scale: combinedScale }] }}>
      <Card
        style={[
          styles.card,
          { backgroundColor: binColor },
          !isDark && layout.shadowHero,
          getUrgencyStyle(),
        ]}
        onPress={handlePress}
        hapticFeedback={false}
      >
      {/* Background pattern overlay */}
      <View style={styles.patternOverlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* Left side - Icon and bin name */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          <Text style={styles.binName}>{binName}</Text>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>

        {/* Right side - Countdown */}
        <View style={styles.rightSection}>
          <View style={styles.countdownBadge}>
            <Clock size={16} color="#FFFFFF" strokeWidth={2} style={styles.clockIcon} />
            <Text style={styles.countdownText}>{getCountdownText()}</Text>
          </View>
          {daysUntil <= 1 && (
            <Text style={styles.reminderText}>
              Put out by 7am
            </Text>
          )}
        </View>
      </View>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>NEXT COLLECTION</Text>
      </View>
    </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 140,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 32,
  },
  leftSection: {
    flex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  binName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  clockIcon: {
    marginRight: 6,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reminderText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    fontWeight: '500',
  },
  labelContainer: {
    position: 'absolute',
    top: 12,
    left: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
});
