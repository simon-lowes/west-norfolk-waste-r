import { useState, useMemo, useCallback } from 'react';
import { WasteItem } from '../types';
import { mockWasteItems } from '../data';
import { searchWasteItems } from '../utils';

interface UseWasteSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: WasteItem[];
  isSearching: boolean;
  clearSearch: () => void;
  allItems: WasteItem[];
}

export function useWasteSearch(): UseWasteSearchResult {
  const [query, setQueryState] = useState('');

  const results = useMemo(() => {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return searchWasteItems(mockWasteItems, query);
  }, [query]);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching: query.length > 0,
    clearSearch,
    allItems: mockWasteItems,
  };
}
