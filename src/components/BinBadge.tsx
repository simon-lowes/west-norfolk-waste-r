import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BinType, getBinTypeName, getBinColorKey } from '../types';
import { useTheme } from '../theme';

interface BinBadgeProps {
  binType: BinType;
  size?: 'small' | 'medium' | 'large';
}

export function BinBadge({ binType, size = 'medium' }: BinBadgeProps) {
  const { colors, layout } = useTheme();
  const colorKey = getBinColorKey(binType);
  const binColor = colors[colorKey];
  const label = getBinTypeName(binType);

  const sizeStyles = {
    small: {
      paddingVertical: 2,
      paddingHorizontal: 8,
      fontSize: 11,
    },
    medium: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      fontSize: 13,
    },
    large: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      fontSize: 15,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: binColor + '20', // 20% opacity
          borderColor: binColor,
          borderRadius: layout.radiusFull,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: binColor,
            fontSize: currentSize.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
