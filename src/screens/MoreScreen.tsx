import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemePreference } from '../theme';
import { useProperty, useAlerts, useDismissedAlerts, useDevMode } from '../hooks';
import { Card, ThemeToggle } from '../components';
import {
  Bell,
  AlertTriangle,
  Settings,
  MapPin,
  ChevronRight,
  Info,
  MessageSquare,
  Palette,
  Database,
} from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MoreScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  badge?: number;
  rightElement?: React.ReactNode;
}

function MenuItem({ icon, title, subtitle, onPress, badge, rightElement }: MenuItemProps) {
  const { colors, layout } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: colors.surface,
          borderRadius: layout.radiusLarge,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.primary + '15' }]}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.alertUrgent }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {rightElement || <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />}
    </Pressable>
  );
}

const getThemeLabel = (preference: ThemePreference, isDark: boolean): string => {
  switch (preference) {
    case 'system':
      return `Auto (${isDark ? 'Dark' : 'Light'})`;
    case 'light':
      return 'Light mode';
    case 'dark':
      return 'Dark mode';
  }
};

export function MoreScreen({ navigation }: MoreScreenProps) {
  const { colors, layout, isDark, preference } = useTheme();
  const { selectedProperty } = useProperty();
  const { alerts } = useAlerts(selectedProperty?.postcode ?? null);
  const { isAlertDismissed } = useDismissedAlerts();
  const { isDemoMode, toggleMode } = useDevMode();

  // Count unread alerts
  const unreadAlerts = alerts.filter((a) => !isAlertDismissed(a.id)).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>More</Text>
        </View>

        {/* Property Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          YOUR PROPERTY
        </Text>
        <MenuItem
          icon={<MapPin size={20} color={colors.primary} strokeWidth={2} />}
          title={selectedProperty?.address ?? 'Select Property'}
          subtitle={selectedProperty?.postcode ?? 'Tap to choose your address'}
          onPress={() => navigation.navigate('Settings')}
        />

        {/* Actions Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          ACTIONS
        </Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon={<Bell size={20} color={colors.alertWarning} strokeWidth={2} />}
            title="Service Alerts"
            subtitle="Collection changes & disruptions"
            onPress={() => navigation.navigate('Alerts')}
            badge={unreadAlerts}
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
          <MenuItem
            icon={<AlertTriangle size={20} color={colors.alertUrgent} strokeWidth={2} />}
            title="Report an Issue"
            subtitle="Missed bin, fly-tipping, damaged bin"
            onPress={() => navigation.navigate('Report')}
          />
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          PREFERENCES
        </Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon={<Palette size={20} color={colors.centre} strokeWidth={2} />}
            title="Appearance"
            subtitle={getThemeLabel(preference, isDark)}
            onPress={() => {}}
            rightElement={<ThemeToggle showLabel={false} />}
          />
          <View style={[styles.separator, { backgroundColor: colors.borderLight }]} />
          <MenuItem
            icon={<Database size={20} color={colors.primary} strokeWidth={2} />}
            title="Data Source"
            subtitle={isDemoMode ? 'Using sample data' : 'Using live alerts'}
            onPress={toggleMode}
            rightElement={
              <Text style={[styles.modeLabel, { color: colors.textSecondary }]}>
                {isDemoMode ? 'Demo' : 'Live'}
              </Text>
            }
          />
        </View>

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          ABOUT
        </Text>
        <Card style={styles.aboutCard}>
          <Text style={[styles.aboutTitle, { color: colors.text }]}>
            West Norfolk Waste
          </Text>
          <Text style={[styles.aboutVersion, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            Helping West Norfolk residents manage household waste collection schedules,
            find recycling information, and locate nearby recycling centres.
          </Text>
        </Card>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  menuGroup: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  aboutCard: {
    padding: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 13,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
});
