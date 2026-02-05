import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useProperty, useCollections, useAlerts, useDismissedAlerts } from '../hooks';
import { Card, CollectionCard, HeroCollectionCard, AlertCard, EmptyState, Button } from '../components';
import { MapPin, Calendar, Bell, ChevronRight, Search, Sparkles } from 'lucide-react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<any>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { colors, layout } = useTheme();
  const { selectedProperty } = useProperty();
  const { collections, nextCollection } = useCollections(selectedProperty);
  const { alerts } = useAlerts(selectedProperty?.postcode ?? null);
  const { isAlertDismissed, dismissAlert } = useDismissedAlerts();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  // Filter visible alerts
  const visibleAlerts = alerts.filter((a) => !isAlertDismissed(a.id)).slice(0, 2);

  // Get remaining collections (excluding the first/next one)
  const remainingCollections = collections.slice(1, 4);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            West Norfolk Waste
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your collection schedule
          </Text>
        </View>

        {/* Property Card */}
        <Card
          style={styles.propertyCard}
          onPress={() => navigation.navigate('More', { screen: 'Settings' })}
        >
          <View style={styles.propertyContent}>
            <View style={[styles.propertyIcon, { backgroundColor: colors.primary + '15' }]}>
              <MapPin size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.propertyInfo}>
              {selectedProperty ? (
                <>
                  <Text style={[styles.propertyAddress, { color: colors.text }]}>
                    {selectedProperty.address}
                  </Text>
                  <Text style={[styles.propertyPostcode, { color: colors.textSecondary }]}>
                    {selectedProperty.postcode}
                  </Text>
                </>
              ) : (
                <Text style={[styles.propertyPlaceholder, { color: colors.textSecondary }]}>
                  Tap to select your property
                </Text>
              )}
            </View>
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          </View>
        </Card>

        {/* Alerts Section - Show prominently if there are any */}
        {visibleAlerts.length > 0 && (
          <View style={styles.alertsSection}>
            {visibleAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                compact
                onDismiss={() => dismissAlert(alert.id)}
              />
            ))}
            {alerts.length > 2 && (
              <Button
                title={`View all ${alerts.length} alerts`}
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('More', { screen: 'Alerts' })}
              />
            )}
          </View>
        )}

        {/* Main Content - Hero Card or Empty State */}
        {selectedProperty ? (
          <>
            {/* Hero Next Collection Card */}
            {nextCollection && (
              <HeroCollectionCard
                binType={nextCollection.binType}
                date={nextCollection.date}
                daysUntil={nextCollection.daysUntil}
                onPress={() => navigation.navigate('Schedule')}
              />
            )}

            {/* Quick Search Prompt */}
            <Pressable
              onPress={() => navigation.navigate('WhatGoesWhere')}
              style={({ pressed }) => [
                styles.quickSearchCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: layout.radiusLarge,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Search size={20} color={colors.textTertiary} strokeWidth={2} />
              <Text style={[styles.quickSearchText, { color: colors.textTertiary }]}>
                What bin does it go in?
              </Text>
            </Pressable>

            {/* Coming Up Section */}
            {remainingCollections.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Calendar size={18} color={colors.textSecondary} strokeWidth={2} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Coming Up
                  </Text>
                </View>

                {remainingCollections.map((collection) => (
                  <CollectionCard
                    key={collection.binType}
                    binType={collection.binType}
                    date={collection.date}
                    daysUntil={collection.daysUntil}
                    compact
                  />
                ))}

                <Button
                  title="View full schedule"
                  variant="secondary"
                  onPress={() => navigation.navigate('Schedule')}
                  style={styles.viewAllButton}
                />
              </View>
            )}
          </>
        ) : (
          /* Empty State for no property */
          <View style={styles.emptyStateContainer}>
            <EmptyState
              icon={<Sparkles size={48} color={colors.primary} strokeWidth={1.5} />}
              title="Welcome!"
              message="Select your property to see your bin collection schedule and get reminders."
              action={
                <Button
                  title="Select Property"
                  onPress={() => navigation.navigate('More', { screen: 'Settings' })}
                />
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  propertyCard: {
    marginBottom: 16,
  },
  propertyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyAddress: {
    fontSize: 15,
    fontWeight: '600',
  },
  propertyPostcode: {
    fontSize: 13,
    marginTop: 2,
  },
  propertyPlaceholder: {
    fontSize: 14,
  },
  alertsSection: {
    marginBottom: 8,
  },
  quickSearchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  quickSearchText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewAllButton: {
    marginTop: 4,
  },
  emptyStateContainer: {
    marginTop: 32,
  },
});
