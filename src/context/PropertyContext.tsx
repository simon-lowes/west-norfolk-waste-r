import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property } from '../types';
import { mockProperties } from '../data';

const PROPERTY_STORAGE_KEY = '@west_norfolk_waste_selected_property';

interface PropertyContextType {
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  allProperties: Property[];
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export function PropertyProvider({ children }: PropertyProviderProps) {
  const [selectedProperty, setSelectedPropertyState] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved property on mount
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const savedPropertyId = await AsyncStorage.getItem(PROPERTY_STORAGE_KEY);
        if (savedPropertyId) {
          const property = mockProperties.find((p) => p.id === savedPropertyId);
          if (property) {
            setSelectedPropertyState(property);
          }
        }
      } catch (error) {
        console.warn('Failed to load saved property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, []);

  // Save property when changed
  const setSelectedProperty = useCallback(async (property: Property | null) => {
    setSelectedPropertyState(property);
    try {
      if (property) {
        await AsyncStorage.setItem(PROPERTY_STORAGE_KEY, property.id);
      } else {
        await AsyncStorage.removeItem(PROPERTY_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save property selection:', error);
    }
  }, []);

  const value: PropertyContextType = {
    selectedProperty,
    setSelectedProperty,
    allProperties: mockProperties,
    isLoading,
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
}

export function useProperty(): PropertyContextType {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}
