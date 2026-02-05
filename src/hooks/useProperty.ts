import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property } from '../types';
import { mockProperties } from '../data';

const PROPERTY_STORAGE_KEY = '@west_norfolk_waste_selected_property';

interface UsePropertyResult {
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  allProperties: Property[];
  isLoading: boolean;
}

export function useProperty(): UsePropertyResult {
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
      console.warn('Failed to save property selection:', error);
    }
  }, []);

  return {
    selectedProperty,
    setSelectedProperty,
    allProperties: mockProperties,
    isLoading,
  };
}
