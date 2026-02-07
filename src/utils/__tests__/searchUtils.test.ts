import { searchWasteItems, highlightMatch } from '../searchUtils';
import { WasteItem, BinType } from '../../types';

const testItems: WasteItem[] = [
  {
    id: 'waste-cardboard',
    name: 'Cardboard boxes',
    binType: BinType.RECYCLING,
    notes: 'Flatten and remove tape.',
    keywords: ['box', 'packaging', 'amazon', 'delivery'],
  },
  {
    id: 'waste-batteries',
    name: 'Batteries',
    binType: BinType.RECYCLING_CENTRE,
    notes: 'Take to recycling centre.',
    keywords: ['AA', 'AAA', 'lithium', 'duracell'],
  },
  {
    id: 'waste-nappies',
    name: 'Nappies and baby wipes',
    binType: BinType.GENERAL,
    notes: 'Bag securely.',
    keywords: ['diapers', 'pampers', 'baby', 'nappy'],
  },
  {
    id: 'waste-tea-bags',
    name: 'Tea bags and coffee grounds',
    binType: BinType.FOOD,
    notes: 'Food waste.',
    keywords: ['tea', 'coffee', 'teabags', 'espresso'],
  },
  {
    id: 'waste-grass',
    name: 'Grass cuttings',
    binType: BinType.GARDEN,
    notes: 'Garden waste bin.',
    keywords: ['lawn', 'mowing', 'turf'],
  },
  {
    id: 'waste-pizza-clean',
    name: 'Pizza box (clean)',
    binType: BinType.RECYCLING,
    notes: 'Clean boxes can be recycled.',
    keywords: ['pizza', 'dominos', 'takeaway'],
  },
  {
    id: 'waste-pizza-greasy',
    name: 'Pizza box (greasy)',
    binType: BinType.GENERAL,
    notes: 'Greasy boxes go in general waste.',
    keywords: ['pizza', 'greasy', 'oily'],
  },
];

describe('searchWasteItems', () => {
  describe('empty and invalid queries', () => {
    it('should return empty array for empty string', () => {
      expect(searchWasteItems(testItems, '')).toEqual([]);
    });

    it('should return empty array for whitespace-only query', () => {
      expect(searchWasteItems(testItems, '   ')).toEqual([]);
    });

    it('should return empty array for null-like falsy query', () => {
      expect(searchWasteItems(testItems, '')).toEqual([]);
    });
  });

  describe('exact name matching', () => {
    it('should find exact name match (case-insensitive)', () => {
      const results = searchWasteItems(testItems, 'Batteries');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('waste-batteries');
    });

    it('should match exact name regardless of case', () => {
      const results = searchWasteItems(testItems, 'batteries');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('waste-batteries');
    });
  });

  describe('partial name matching', () => {
    it('should find items where name starts with query', () => {
      const results = searchWasteItems(testItems, 'card');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].id).toBe('waste-cardboard');
    });

    it('should find items where name contains query', () => {
      const results = searchWasteItems(testItems, 'box');
      expect(results.length).toBeGreaterThanOrEqual(1);
      // Should find cardboard boxes and pizza boxes
      const ids = results.map((r) => r.id);
      expect(ids).toContain('waste-cardboard');
    });
  });

  describe('keyword matching', () => {
    it('should find items by keyword', () => {
      const results = searchWasteItems(testItems, 'amazon');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].id).toBe('waste-cardboard');
    });

    it('should find items by partial keyword', () => {
      const results = searchWasteItems(testItems, 'pamper');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].id).toBe('waste-nappies');
    });
  });

  describe('pizza search (common use case)', () => {
    it('should return both pizza box results for "pizza"', () => {
      const results = searchWasteItems(testItems, 'pizza');
      expect(results.length).toBe(2);
      const ids = results.map((r) => r.id);
      expect(ids).toContain('waste-pizza-clean');
      expect(ids).toContain('waste-pizza-greasy');
    });
  });

  describe('scoring and ordering', () => {
    it('should rank exact name match higher than keyword match', () => {
      // "tea" should match "Tea bags and coffee grounds" (name starts with) above keyword matches
      const results = searchWasteItems(testItems, 'tea');
      expect(results[0].id).toBe('waste-tea-bags');
    });

    it('should rank name-starts-with higher than name-contains', () => {
      const results = searchWasteItems(testItems, 'grass');
      expect(results[0].id).toBe('waste-grass');
    });
  });

  describe('fuzzy matching', () => {
    it('should match fuzzy queries where characters appear in order', () => {
      // "cdbx" -> matches "Cardboard boxes" (c-a-r-d-b-o-a-r-d- -b-o-x-e-s)
      const results = searchWasteItems(testItems, 'cdbx');
      // All characters c, d, b, x appear in "cardboard boxes" in order
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('should not match when characters are not in order', () => {
      const results = searchWasteItems(testItems, 'zzzzzz');
      expect(results).toHaveLength(0);
    });
  });

  describe('no results', () => {
    it('should return empty array when nothing matches', () => {
      const results = searchWasteItems(testItems, 'xylophone');
      expect(results).toHaveLength(0);
    });
  });

  describe('case insensitivity', () => {
    it('should be case-insensitive for names', () => {
      const lower = searchWasteItems(testItems, 'cardboard');
      const upper = searchWasteItems(testItems, 'CARDBOARD');
      const mixed = searchWasteItems(testItems, 'CaRdBoArD');
      expect(lower).toEqual(upper);
      expect(lower).toEqual(mixed);
    });

    it('should be case-insensitive for keywords', () => {
      const lower = searchWasteItems(testItems, 'amazon');
      const upper = searchWasteItems(testItems, 'AMAZON');
      expect(lower.length).toBe(upper.length);
    });
  });

  describe('trimming', () => {
    it('should trim whitespace from query', () => {
      const trimmed = searchWasteItems(testItems, 'batteries');
      const padded = searchWasteItems(testItems, '  batteries  ');
      expect(trimmed).toEqual(padded);
    });
  });
});

describe('highlightMatch', () => {
  it('should return full text as non-match when query is empty', () => {
    const result = highlightMatch('Cardboard boxes', '');
    expect(result).toEqual([{ text: 'Cardboard boxes', isMatch: false }]);
  });

  it('should return full text as non-match when query is whitespace', () => {
    const result = highlightMatch('Cardboard boxes', '   ');
    expect(result).toEqual([{ text: 'Cardboard boxes', isMatch: false }]);
  });

  it('should highlight matching substring', () => {
    const result = highlightMatch('Cardboard boxes', 'board');
    expect(result).toEqual([
      { text: 'Card', isMatch: false },
      { text: 'board', isMatch: true },
      { text: ' boxes', isMatch: false },
    ]);
  });

  it('should highlight at start of string', () => {
    const result = highlightMatch('Cardboard boxes', 'card');
    expect(result).toEqual([
      { text: 'Card', isMatch: true },
      { text: 'board boxes', isMatch: false },
    ]);
  });

  it('should highlight at end of string', () => {
    const result = highlightMatch('Cardboard boxes', 'boxes');
    expect(result).toEqual([
      { text: 'Cardboard ', isMatch: false },
      { text: 'boxes', isMatch: true },
    ]);
  });

  it('should return full text as non-match when no match found', () => {
    const result = highlightMatch('Cardboard boxes', 'xyz');
    expect(result).toEqual([{ text: 'Cardboard boxes', isMatch: false }]);
  });

  it('should be case-insensitive', () => {
    const result = highlightMatch('Cardboard boxes', 'CARD');
    expect(result).toHaveLength(2);
    expect(result[0].isMatch).toBe(true);
  });
});
