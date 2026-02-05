import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, areFontsLoaded, typography } from '../theme';
import { useWasteSearch } from '../hooks';
import { WasteItem, BinType, getBinColorKey } from '../types';
import { SearchInput, Card, BinBadge, EmptyState } from '../components';
import { Search, Trash2, Recycle, Leaf, UtensilsCrossed, Building2, Lightbulb } from 'lucide-react-native';

// Popular search suggestions
const POPULAR_SEARCHES = [
  'batteries',
  'pizza box',
  'plastic bag',
  'glass bottle',
  'food scraps',
  'clothes',
  'cardboard',
  'nappies',
];

export function WhatGoesWhereScreen() {
  const { colors, layout } = useTheme();
  const { query, setQuery, results, isSearching, clearSearch } = useWasteSearch();

  const getBinIcon = (binType: BinType) => {
    const colorKey = getBinColorKey(binType);
    const binColor = colors[colorKey];
    const iconProps = { size: 20, color: binColor, strokeWidth: 2 };

    switch (binType) {
      case BinType.GENERAL:
        return <Trash2 {...iconProps} />;
      case BinType.RECYCLING:
        return <Recycle {...iconProps} />;
      case BinType.GARDEN:
        return <Leaf {...iconProps} />;
      case BinType.FOOD:
        return <UtensilsCrossed {...iconProps} />;
      case BinType.RECYCLING_CENTRE:
        return <Building2 {...iconProps} />;
    }
  };

  const renderItem = ({ item }: { item: WasteItem }) => {
    const colorKey = getBinColorKey(item.binType);
    const binColor = colors[colorKey];

    return (
      <Card style={[styles.itemCard, { borderLeftColor: binColor, borderLeftWidth: 4 }]}>
        <View style={styles.itemHeader}>
          <View style={[styles.binIconContainer, { backgroundColor: binColor + '15' }]}>
            {getBinIcon(item.binType)}
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            <BinBadge binType={item.binType} size="small" />
          </View>
        </View>
        <Text style={[styles.itemNotes, { color: colors.textSecondary }]}>
          {item.notes}
        </Text>
      </Card>
    );
  };

  const renderEmptySearch = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Lightbulb size={48} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        What goes where?
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
        Search our database of 77+ items to find out the correct bin
      </Text>

      {/* Popular searches */}
      <View style={styles.popularSection}>
        <Text style={[styles.popularTitle, { color: colors.textSecondary }]}>
          Popular searches
        </Text>
        <View style={styles.popularGrid}>
          {POPULAR_SEARCHES.map((term) => (
            <Pressable
              key={term}
              onPress={() => setQuery(term)}
              style={({ pressed }) => [
                styles.popularChip,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderRadius: layout.radiusFull,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.popularChipText, { color: colors.text }]}>
                {term}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bin type legend */}
      <View style={[styles.legendContainer, { backgroundColor: colors.surface, borderRadius: layout.radiusLarge }]}>
        <Text style={[styles.legendTitle, { color: colors.text }]}>
          Bin types
        </Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.rubbish }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>General (Black)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.recycling }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Recycling (Blue)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.garden }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Garden (Green)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.food }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Food (Brown)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.centre }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Recycling Centre</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNoResults = () => (
    <EmptyState
      icon={<Trash2 size={48} color={colors.textTertiary} strokeWidth={1.5} />}
      title="Hmm, that's a tricky one..."
      message={`We couldn't find "${query}" in our database. Try searching with different words, or check your local recycling centre.`}
    />
  );

  const renderResultsHeader = () => (
    <View style={styles.resultsHeader}>
      <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
        {results.length} result{results.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { color: colors.text },
          areFontsLoaded() && { fontFamily: typography.fontFamily.headline }
        ]}>
          What Goes Where
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find out how to dispose of items correctly
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for an item (e.g. batteries, pizza box)"
          onClear={clearSearch}
        />
      </View>

      {/* Results or Empty State */}
      {isSearching ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            results.length === 0 && styles.listContentEmpty,
          ]}
          ListHeaderComponent={results.length > 0 ? renderResultsHeader : null}
          ListEmptyComponent={renderNoResults}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderEmptySearch()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  binIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  itemNotes: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 48,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 32,
  },
  popularSection: {
    width: '100%',
    marginBottom: 24,
  },
  popularTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  popularChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legendContainer: {
    width: '100%',
    padding: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
});
