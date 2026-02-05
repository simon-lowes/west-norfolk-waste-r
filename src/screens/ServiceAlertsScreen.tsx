import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useProperty, useAlerts, useDismissedAlerts } from '../hooks';
import { ServiceAlert } from '../types';
import { AlertCard, EmptyState, Button } from '../components';
import { Bell, CheckCircle } from 'lucide-react-native';

export function ServiceAlertsScreen() {
  const { colors } = useTheme();
  const { selectedProperty } = useProperty();
  const { alerts } = useAlerts(selectedProperty?.postcode ?? null);
  const { isAlertDismissed, dismissAlert, clearDismissed, dismissedAlertIds } = useDismissedAlerts();

  // Separate visible and dismissed alerts
  const visibleAlerts = alerts.filter((a) => !isAlertDismissed(a.id));
  const dismissedAlerts = alerts.filter((a) => isAlertDismissed(a.id));

  const renderAlert = ({ item }: { item: ServiceAlert }) => (
    <AlertCard
      alert={item}
      onDismiss={() => dismissAlert(item.id)}
    />
  );

  const renderDismissedAlert = ({ item }: { item: ServiceAlert }) => (
    <View style={styles.dismissedCard}>
      <AlertCard alert={item} compact />
    </View>
  );

  const renderEmpty = () => (
    <EmptyState
      icon={<CheckCircle size={48} color={colors.success} strokeWidth={1.5} />}
      title="All clear!"
      message={
        selectedProperty
          ? "There are no service alerts affecting your area right now."
          : "Select a property to see alerts specific to your area."
      }
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Service Alerts
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {selectedProperty
            ? `Showing alerts for ${selectedProperty.postcode}`
            : 'Showing all alerts'}
        </Text>
      </View>

      <FlatList
        data={visibleAlerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          visibleAlerts.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          dismissedAlerts.length > 0 ? (
            <View style={styles.dismissedSection}>
              <View style={styles.dismissedHeader}>
                <Text style={[styles.dismissedTitle, { color: colors.textSecondary }]}>
                  Dismissed ({dismissedAlerts.length})
                </Text>
                <Button
                  title="Show all"
                  variant="ghost"
                  size="small"
                  onPress={clearDismissed}
                />
              </View>
              {dismissedAlerts.map((alert) => (
                <View key={alert.id} style={styles.dismissedCard}>
                  <AlertCard alert={alert} compact />
                </View>
              ))}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  dismissedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dismissedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dismissedTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  dismissedCard: {
    opacity: 0.6,
  },
});
