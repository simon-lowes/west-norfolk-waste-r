import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property } from '../types';

const STORAGE_KEY = '@west_norfolk_waste_notifications_enabled';

const NOTIFICATION_CONFIGS: {
  key: string;
  title: string;
  body: string;
  propertyField: keyof Pick<Property, 'rubbishDayOfWeek' | 'recyclingDayOfWeek' | 'gardenDayOfWeek' | 'foodDayOfWeek'>;
}[] = [
  {
    key: 'general',
    title: 'General waste tomorrow',
    body: "Your black bin is collected tomorrow. Don't forget to put it out!",
    propertyField: 'rubbishDayOfWeek',
  },
  {
    key: 'recycling',
    title: 'Recycling tomorrow',
    body: "Your blue bin is collected tomorrow. Don't forget to put it out!",
    propertyField: 'recyclingDayOfWeek',
  },
  {
    key: 'garden',
    title: 'Garden waste tomorrow',
    body: "Your green bin is collected tomorrow. Don't forget to put it out!",
    propertyField: 'gardenDayOfWeek',
  },
  {
    key: 'food',
    title: 'Food waste tomorrow',
    body: "Your brown caddy is collected tomorrow. Don't forget to put it out!",
    propertyField: 'foodDayOfWeek',
  },
];

function getNotificationId(key: string): string {
  return `collection-reminder-${key}`;
}

/**
 * Convert a JS day-of-week (0=Sun..6=Sat) to the expo-notifications
 * weekday for the EVENING BEFORE that day.
 *
 * Expo weekday: 1=Sunday, 2=Monday...7=Saturday
 */
function getEveningBeforeExpoWeekday(jsDayOfWeek: number): number {
  // Day before in JS: (day + 6) % 7  (wraps Sun→Sat)
  const dayBeforeJS = (jsDayOfWeek + 6) % 7;
  // Convert JS day (0=Sun) to expo weekday (1=Sun): add 1
  return dayBeforeJS + 1;
}

async function scheduleAll(property: Property): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = require('expo-notifications');

  for (const config of NOTIFICATION_CONFIGS) {
    const id = getNotificationId(config.key);
    const collectionDay = property[config.propertyField];
    const weekday = getEveningBeforeExpoWeekday(collectionDay);

    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: config.title,
        body: config.body,
        sound: true,
      },
      trigger: {
        type: 'weekly',
        weekday,
        hour: 19,
        minute: 0,
      },
    });
  }
}

async function cancelAll(): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = require('expo-notifications');

  for (const config of NOTIFICATION_CONFIGS) {
    await Notifications.cancelScheduledNotificationAsync(
      getNotificationId(config.key)
    );
  }
}

async function requestPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const Notifications = require('expo-notifications');
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function checkPermission(): Promise<boolean | null> {
  if (Platform.OS === 'web') return null;

  const Notifications = require('expo-notifications');
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export function useNotifications(property: Property | null) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  // Load persisted preference and permission status on mount
  useEffect(() => {
    async function init() {
      if (Platform.OS === 'web') {
        setIsLoading(false);
        return;
      }

      const [stored, granted] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        checkPermission(),
      ]);

      setPermissionGranted(granted);
      const enabled = stored === 'true' && granted === true;
      setIsEnabled(enabled);
      setIsLoading(false);
    }
    init();
  }, []);

  // Re-schedule when property changes (while enabled)
  useEffect(() => {
    if (!isEnabled || !property || Platform.OS === 'web') return;

    cancelAll().then(() => scheduleAll(property));
  }, [isEnabled, property?.id]);

  const toggleNotifications = useCallback(async () => {
    if (Platform.OS === 'web' || !property) return;

    if (isEnabled) {
      // Turning off
      await cancelAll();
      await AsyncStorage.setItem(STORAGE_KEY, 'false');
      setIsEnabled(false);
    } else {
      // Turning on — request permission first
      const granted = await requestPermission();
      setPermissionGranted(granted);

      if (!granted) return;

      await scheduleAll(property);
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      setIsEnabled(true);
    }
  }, [isEnabled, property]);

  const reschedule = useCallback(async (prop: Property | null) => {
    if (Platform.OS === 'web' || !prop || !isEnabled) return;
    await cancelAll();
    await scheduleAll(prop);
  }, [isEnabled]);

  return {
    isEnabled,
    isLoading,
    permissionGranted,
    toggleNotifications,
    reschedule,
  };
}
