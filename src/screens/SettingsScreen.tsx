import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Modal,
  Pressable,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme, areFontsLoaded, typography, ThemePreference } from '../theme';
import { useProperty, useDevMode } from '../hooks';
import { Property } from '../types';
import { Card, ThemeToggle, Button, SearchInput } from '../components';
import { MapPin, Check, X, ChevronRight, Palette, FlaskConical, Bell } from 'lucide-react-native';
import { useNotifications } from '../hooks';

// Number of taps on version to reveal dev mode
const DEV_MODE_TAP_COUNT = 5;
const TAP_RESET_DELAY = 2000; // Reset tap count after 2 seconds of inactivity

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

export function SettingsScreen() {
  const { colors, layout, isDark, preference } = useTheme();
  const { selectedProperty, setSelectedProperty, allProperties } = useProperty();
  const { isDemoMode, toggleMode } = useDevMode();
  const { isEnabled: notificationsEnabled, toggleNotifications } = useNotifications(selectedProperty);
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDevMode, setShowDevMode] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  // Handle taps on version to reveal dev mode
  const handleVersionTap = () => {
    tapCountRef.current += 1;

    // Clear any existing timer
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    // Set timer to reset tap count
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_RESET_DELAY);

    if (tapCountRef.current >= DEV_MODE_TAP_COUNT) {
      tapCountRef.current = 0;
      setShowDevMode(true);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleNotificationToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleNotifications();
  };

  const handleDevModeToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleMode();
  };

  // Filter properties by search query
  const filteredProperties = allProperties.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.address.toLowerCase().includes(query) ||
      p.postcode.toLowerCase().includes(query)
    );
  });

  const selectProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyPicker(false);
    setSearchQuery('');
  };

  const renderPropertyItem = ({ item }: { item: Property }) => {
    const isSelected = selectedProperty?.id === item.id;
    return (
      <Pressable
        onPress={() => selectProperty(item)}
        style={[
          styles.propertyItem,
          {
            backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
            borderBottomColor: colors.borderLight,
          },
        ]}
      >
        <View style={styles.propertyItemContent}>
          <Text style={[styles.propertyItemAddress, { color: colors.text }]}>
            {item.address}
          </Text>
          <Text style={[styles.propertyItemPostcode, { color: colors.textSecondary }]}>
            {item.postcode}
          </Text>
        </View>
        {isSelected && <Check size={20} color={colors.primary} strokeWidth={2} />}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[
            styles.title,
            { color: colors.text },
            areFontsLoaded() && { fontFamily: typography.fontFamily.headline }
          ]}>
            Settings
          </Text>
        </View>

        {/* Property Selection */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          YOUR PROPERTY
        </Text>
        <Card
          style={styles.settingCard}
          onPress={() => setShowPropertyPicker(true)}
        >
          <View style={styles.settingContent}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
              <MapPin size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              {selectedProperty ? (
                <>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {selectedProperty.address}
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {selectedProperty.postcode}
                  </Text>
                </>
              ) : (
                <Text style={[styles.settingTitle, { color: colors.textSecondary }]}>
                  Select your property
                </Text>
              )}
            </View>
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          </View>
        </Card>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          NOTIFICATIONS
        </Text>
        <Card style={[styles.settingCard, !selectedProperty && { opacity: 0.5 }]}>
          <View style={styles.settingContent}>
            <View style={[styles.settingIcon, { backgroundColor: colors.food + '15' }]}>
              <Bell size={20} color={colors.food} strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Collection reminders
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {!selectedProperty
                  ? 'Select a property first'
                  : notificationsEnabled
                    ? 'Reminds you at 7pm the night before'
                    : 'Off'}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              disabled={!selectedProperty}
              trackColor={{ false: colors.border, true: colors.food }}
              thumbColor={colors.surface}
            />
          </View>
        </Card>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APPEARANCE
        </Text>
        <Card style={styles.settingCard}>
          <View style={styles.settingContent}>
            <View style={[styles.settingIcon, { backgroundColor: colors.centre + '15' }]}>
              <Palette size={20} color={colors.centre} strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Theme
              </Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {getThemeLabel(preference, isDark)}
              </Text>
            </View>
            <ThemeToggle showLabel={false} />
          </View>
        </Card>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          ABOUT
        </Text>
        <Card style={styles.settingCard}>
          <Text style={[styles.aboutTitle, { color: colors.text }]}>
            West Norfolk Waste
          </Text>
          <Pressable onPress={handleVersionTap}>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
            {!showDevMode && (
              <Text style={[styles.devHintText, { color: colors.textTertiary }]}>
                Tap 5 times for developer options
              </Text>
            )}
          </Pressable>
          <Text style={[styles.aboutText, { color: colors.textSecondary, marginTop: 12 }]}>
            This app helps West Norfolk residents manage their household waste collection schedules,
            find recycling information, and locate nearby recycling centres.
          </Text>
        </Card>

        {/* Developer Mode - Hidden by default, revealed by tapping version 5 times */}
        {showDevMode && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              DEVELOPER
            </Text>
            <Card style={styles.settingCard}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: colors.accent + '15' }]}>
                  <FlaskConical size={20} color={colors.accent} strokeWidth={2} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Data Mode
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {isDemoMode ? 'Demo (mock alerts)' : 'Real (live APIs)'}
                  </Text>
                </View>
                <Switch
                  value={!isDemoMode}
                  onValueChange={handleDevModeToggle}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={isDemoMode ? colors.surface : colors.surface}
                />
              </View>
              <Text style={[styles.devModeNote, { color: colors.textTertiary }]}>
                Demo mode shows all mock alerts for demonstrations. Real mode shows only alerts from live APIs (bank holidays, weather warnings).
              </Text>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Property Picker Modal */}
      <Modal
        visible={showPropertyPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPropertyPicker(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Property
            </Text>
            <Pressable
              onPress={() => {
                setShowPropertyPicker(false);
                setSearchQuery('');
              }}
              style={[styles.closeButton, { backgroundColor: colors.surfaceSecondary }]}
            >
              <X size={20} color={colors.text} strokeWidth={2} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by address or postcode"
            />
          </View>

          <FlatList
            data={filteredProperties}
            renderItem={renderPropertyItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.propertyList}
          />
        </SafeAreaView>
      </Modal>
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
    fontSize: 28,
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
  settingCard: {
    marginBottom: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  propertyList: {
    paddingHorizontal: 16,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  propertyItemContent: {
    flex: 1,
  },
  propertyItemAddress: {
    fontSize: 15,
    fontWeight: '500',
  },
  propertyItemPostcode: {
    fontSize: 13,
    marginTop: 2,
  },
  devModeNote: {
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
  devHintText: {
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
