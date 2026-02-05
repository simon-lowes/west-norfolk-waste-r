import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ServiceAlert, AlertSeverity } from '../types';
import { useTheme } from '../theme';
import { Card } from './Card';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react-native';

interface AlertCardProps {
  alert: ServiceAlert;
  onDismiss?: () => void;
  compact?: boolean;
}

export function AlertCard({ alert, onDismiss, compact = false }: AlertCardProps) {
  const { colors, layout } = useTheme();

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

  return (
    <Card style={cardStyle}>
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
            onPress={onDismiss}
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
