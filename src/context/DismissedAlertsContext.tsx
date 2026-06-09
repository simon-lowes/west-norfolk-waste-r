import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISMISSED_ALERTS_KEY = '@west_norfolk_waste_dismissed_alerts';

interface DismissedAlertsContextType {
  dismissedAlertIds: Set<string>;
  dismissAlert: (alertId: string) => void;
  undoDismiss: (alertId: string) => void;
  isAlertDismissed: (alertId: string) => boolean;
  clearDismissed: () => void;
}

const DismissedAlertsContext = createContext<DismissedAlertsContextType | undefined>(undefined);

interface DismissedAlertsProviderProps {
  children: ReactNode;
}

// Persist a set of dismissed alert ids to AsyncStorage.
function persistDismissed(ids: Set<string>): void {
  AsyncStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(Array.from(ids))).catch((error) => {
    console.error('Failed to save dismissed alerts:', error);
  });
}

export function DismissedAlertsProvider({ children }: DismissedAlertsProviderProps) {
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

  const dismissAlert = useCallback((alertId: string) => {
    setDismissedAlertIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(alertId);
      persistDismissed(newSet);
      return newSet;
    });
  }, []);

  const undoDismiss = useCallback((alertId: string) => {
    setDismissedAlertIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(alertId);
      persistDismissed(newSet);
      return newSet;
    });
  }, []);

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

  const value: DismissedAlertsContextType = {
    dismissedAlertIds,
    dismissAlert,
    undoDismiss,
    isAlertDismissed,
    clearDismissed,
  };

  return (
    <DismissedAlertsContext.Provider value={value}>{children}</DismissedAlertsContext.Provider>
  );
}

export function useDismissedAlerts(): DismissedAlertsContextType {
  const context = useContext(DismissedAlertsContext);
  if (context === undefined) {
    throw new Error('useDismissedAlerts must be used within a DismissedAlertsProvider');
  }
  return context;
}
