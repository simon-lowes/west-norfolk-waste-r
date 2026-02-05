import { WasteItem } from '../types';

/**
 * Simple fuzzy search that matches query against item name and keywords
 * @param items - Array of waste items to search
 * @param query - Search query string
 * @returns Filtered and sorted array of matching items
 */
export function searchWasteItems(items: WasteItem[], query: string): WasteItem[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Score each item based on match quality
  const scoredItems = items.map((item) => {
    let score = 0;
    const nameMatch = item.name.toLowerCase();

    // Exact name match - highest score
    if (nameMatch === normalizedQuery) {
      score = 100;
    }
    // Name starts with query
    else if (nameMatch.startsWith(normalizedQuery)) {
      score = 80;
    }
    // Name contains query as a word
    else if (nameMatch.includes(` ${normalizedQuery}`) || nameMatch.includes(`${normalizedQuery} `)) {
      score = 70;
    }
    // Name contains query
    else if (nameMatch.includes(normalizedQuery)) {
      score = 60;
    }
    // Check keywords
    else {
      const keywordMatch = item.keywords.find((kw) => {
        const kwLower = kw.toLowerCase();
        if (kwLower === normalizedQuery) return true;
        if (kwLower.startsWith(normalizedQuery)) return true;
        if (kwLower.includes(normalizedQuery)) return true;
        return false;
      });

      if (keywordMatch) {
        const kwLower = keywordMatch.toLowerCase();
        if (kwLower === normalizedQuery) {
          score = 50;
        } else if (kwLower.startsWith(normalizedQuery)) {
          score = 40;
        } else {
          score = 30;
        }
      }
    }

    // Fuzzy match - check if all characters in query appear in order
    if (score === 0) {
      const fuzzyMatch = fuzzyMatchScore(nameMatch, normalizedQuery);
      if (fuzzyMatch > 0) {
        score = fuzzyMatch;
      }
    }

    return { item, score };
  });

  // Filter items with score > 0 and sort by score descending
  return scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

/**
 * Simple fuzzy match - checks if characters appear in order
 * Returns a score between 0-20 based on match quality
 */
function fuzzyMatchScore(text: string, query: string): number {
  let queryIndex = 0;
  let consecutiveMatches = 0;
  let maxConsecutive = 0;

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
      consecutiveMatches++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
    } else {
      consecutiveMatches = 0;
    }
  }

  // All characters must be found
  if (queryIndex !== query.length) {
    return 0;
  }

  // Score based on how many consecutive characters matched
  const consecutiveScore = Math.min(maxConsecutive * 2, 10);
  // Bonus for matching a higher percentage of the text
  const coverageScore = Math.min((query.length / text.length) * 10, 10);

  return consecutiveScore + coverageScore;
}

/**
 * Highlight matching text in a string
 * @param text - The text to search in
 * @param query - The query to highlight
 * @returns Array of { text, isMatch } segments
 */
export function highlightMatch(
  text: string,
  query: string
): Array<{ text: string; isMatch: boolean }> {
  if (!query || query.trim().length === 0) {
    return [{ text, isMatch: false }];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return [{ text, isMatch: false }];
  }

  const result: Array<{ text: string; isMatch: boolean }> = [];

  if (index > 0) {
    result.push({ text: text.substring(0, index), isMatch: false });
  }

  result.push({
    text: text.substring(index, index + query.length),
    isMatch: true,
  });

  if (index + query.length < text.length) {
    result.push({
      text: text.substring(index + query.length),
      isMatch: false,
    });
  }

  return result;
}
