import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_MODE_STORAGE_KEY = '@west_norfolk_waste_dev_mode';

type DataMode = 'demo' | 'real';

interface DevModeContextType {
  mode: DataMode;
  isDemoMode: boolean;
  isRealMode: boolean;
  toggleMode: () => void;
  setMode: (mode: DataMode) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

interface DevModeProviderProps {
  children: ReactNode;
}

export function DevModeProvider({ children }: DevModeProviderProps) {
  // Default to demo mode - mock alerts always work for council demos
  const [mode, setModeState] = useState<DataMode>('demo');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const loadMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(DEV_MODE_STORAGE_KEY);
        if (savedMode === 'demo' || savedMode === 'real') {
          setModeState(savedMode);
        }
      } catch (error) {
        console.warn('Failed to load dev mode preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadMode();
  }, []);

  // Save mode preference when it changes
  const setMode = async (newMode: DataMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(DEV_MODE_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Failed to save dev mode preference:', error);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'demo' ? 'real' : 'demo');
  };

  const value: DevModeContextType = {
    mode,
    isDemoMode: mode === 'demo',
    isRealMode: mode === 'real',
    toggleMode,
    setMode,
  };

  // Always render children - the mode will update when loaded
  // This prevents flash and is acceptable since demo is the default anyway
  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode(): DevModeContextType {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
}
