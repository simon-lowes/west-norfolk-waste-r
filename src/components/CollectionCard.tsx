import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { BinType, getBinTypeName, getBinColorKey } from '../types';
import { formatDate, formatDaysUntil, createEntranceAnimation } from '../utils';
import { useTheme } from '../theme';
import { Card } from './Card';
import { Trash2, Recycle, Leaf, UtensilsCrossed, Building2 } from 'lucide-react-native';

interface CollectionCardProps {
  binType: BinType;
  date: Date;
  daysUntil: number;
  compact?: boolean;
  index?: number; // For staggered entrance animation
}

export function CollectionCard({ binType, date, daysUntil, compact = false, index = 0 }: CollectionCardProps) {
  const { colors, spacing } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  // Staggered entrance animation
  useEffect(() => {
    const { start } = createEntranceAnimation(opacity, translateY, index * 100);
    start();
  }, [index, opacity, translateY]);
  const colorKey = getBinColorKey(binType);
  const binColor = colors[colorKey];
  const binName = getBinTypeName(binType);

  const getIcon = () => {
    const iconProps = { size: compact ? 20 : 24, color: binColor, strokeWidth: 2 };
    switch (binType) {
      case BinType.GENERAL:
        return <Trash2 {...iconProps} />;
      case BinType.RECYCLING:
        return <Recycle {...iconProps} />;
      case BinType.GARDEN:
        return <Leaf {...iconProps} />;
      case BinType.FOOD:
        return <UtensilsCrossed {...iconProps} />;
      case BinType.RECYCLING_CENTRE:
        return <Building2 {...iconProps} />;
    }
  };

  const isUrgent = daysUntil <= 1;

  const cardStyle = compact
    ? { ...styles.card, ...styles.cardCompact, borderLeftColor: binColor, borderLeftWidth: 4 }
    : { ...styles.card, borderLeftColor: binColor, borderLeftWidth: 4 };

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Card style={cardStyle}>
        <View style={styles.iconContainer}>{getIcon()}</View>

        <View style={styles.content}>
          <Text
            style={[
              styles.binName,
              { color: colors.text },
              compact && styles.binNameCompact,
            ]}
          >
            {binName}
          </Text>
          <Text
            style={[
              styles.date,
              { color: colors.textSecondary },
              compact && styles.dateCompact,
            ]}
          >
            {formatDate(date)}
          </Text>
        </View>

        <View
          style={[
            styles.daysContainer,
            {
              backgroundColor: isUrgent ? binColor + '20' : colors.surfaceSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.daysText,
              { color: isUrgent ? binColor : colors.textSecondary },
              compact && styles.daysTextCompact,
            ]}
          >
            {formatDaysUntil(daysUntil)}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardCompact: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  binName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  binNameCompact: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
  },
  dateCompact: {
    fontSize: 12,
  },
  daysContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  daysText: {
    fontSize: 13,
    fontWeight: '600',
  },
  daysTextCompact: {
    fontSize: 11,
  },
});
