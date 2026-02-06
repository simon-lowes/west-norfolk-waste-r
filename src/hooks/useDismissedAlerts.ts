import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISMISSED_ALERTS_KEY = '@west_norfolk_waste_dismissed_alerts';

interface UseDismissedAlertsResult {
  dismissedAlertIds: Set<string>;
  dismissAlert: (alertId: string) => void;
  undoDismiss: (alertId: string) => void;
  isAlertDismissed: (alertId: string) => boolean;
  clearDismissed: () => void;
}

export function useDismissedAlerts(): UseDismissedAlertsResult {
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  // Load dismissed alerts on mount
  useEffect(() => {
    const loadDismissed = async () => {
      try {
        const saved = await AsyncStorage.getItem(DISMISSED_ALERTS_KEY);
        if (saved) {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids)) {
            setDismissedAlertIds(new Set(ids));
          }
        }
      } catch (error) {
        console.warn('Failed to load dismissed alerts:', error);
      }
    };

    loadDismissed();
  }, []);

  // Save dismissed alerts when changed
  const saveDismissed = useCallback(async (ids: Set<string>) => {
    try {
      await AsyncStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(Array.from(ids)));
    } catch (error) {
      console.error('Failed to save dismissed alerts:', error);
    }
  }, []);

  const dismissAlert = useCallback(
    (alertId: string) => {
      const newSet = new Set(dismissedAlertIds);
      newSet.add(alertId);
      setDismissedAlertIds(newSet);
      saveDismissed(newSet);
    },
    [dismissedAlertIds, saveDismissed]
  );

  const undoDismiss = useCallback(
    (alertId: string) => {
      const newSet = new Set(dismissedAlertIds);
      newSet.delete(alertId);
      setDismissedAlertIds(newSet);
      saveDismissed(newSet);
    },
    [dismissedAlertIds, saveDismissed]
  );

  const isAlertDismissed = useCallback(
    (alertId: string) => dismissedAlertIds.has(alertId),
    [dismissedAlertIds]
  );

  const clearDismissed = useCallback(() => {
    setDismissedAlertIds(new Set());
    AsyncStorage.removeItem(DISMISSED_ALERTS_KEY).catch((error) => {
      console.warn('Failed to clear dismissed alerts:', error);
    });
  }, []);

  return {
    dismissedAlertIds,
    dismissAlert,
    undoDismiss,
    isAlertDismissed,
    clearDismissed,
  };
}
