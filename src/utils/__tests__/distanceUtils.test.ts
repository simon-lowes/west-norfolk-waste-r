import {
  calculateDistance,
  formatDistance,
  formatDistanceMiles,
  sortByDistance,
} from '../distanceUtils';

describe('distanceUtils', () => {
  describe('calculateDistance (Haversine)', () => {
    it('should return 0 for the same point', () => {
      const distance = calculateDistance(52.7541, 0.3987, 52.7541, 0.3987);
      expect(distance).toBe(0);
    });

    it('should calculate distance between Kings Lynn and Downham Market (~12km)', () => {
      // Kings Lynn: 52.7541, 0.3987 — Downham Market: 52.6072, 0.3803
      const distance = calculateDistance(52.7541, 0.3987, 52.6072, 0.3803);
      expect(distance).toBeGreaterThan(10);
      expect(distance).toBeLessThan(20);
    });

    it('should calculate distance between London and Edinburgh (~530km)', () => {
      const distance = calculateDistance(51.5074, -0.1278, 55.9533, -3.1883);
      expect(distance).toBeGreaterThan(500);
      expect(distance).toBeLessThan(600);
    });

    it('should be symmetric (A to B equals B to A)', () => {
      const ab = calculateDistance(52.7541, 0.3987, 52.6072, 0.3803);
      const ba = calculateDistance(52.6072, 0.3803, 52.7541, 0.3987);
      expect(ab).toBeCloseTo(ba, 10);
    });

    it('should handle zero longitude difference', () => {
      const distance = calculateDistance(52.0, 0.5, 53.0, 0.5);
      // ~111 km per degree of latitude
      expect(distance).toBeGreaterThan(100);
      expect(distance).toBeLessThan(120);
    });

    it('should handle zero latitude difference', () => {
      const distance = calculateDistance(52.0, 0.0, 52.0, 1.0);
      // At lat 52, ~68 km per degree of longitude
      expect(distance).toBeGreaterThan(60);
      expect(distance).toBeLessThan(80);
    });

    it('should handle negative coordinates', () => {
      // New York to London
      const distance = calculateDistance(40.7128, -74.006, 51.5074, -0.1278);
      expect(distance).toBeGreaterThan(5000);
      expect(distance).toBeLessThan(6000);
    });

    it('should handle near-antipodal points', () => {
      // North Pole area to South Pole area
      const distance = calculateDistance(89.0, 0.0, -89.0, 0.0);
      // Should be close to half Earth's circumference (~20000 km)
      expect(distance).toBeGreaterThan(19000);
      expect(distance).toBeLessThan(20100);
    });
  });

  describe('formatDistance', () => {
    it('should format distance < 1km in metres', () => {
      expect(formatDistance(0.5)).toBe('500 m');
    });

    it('should round metres to nearest integer', () => {
      expect(formatDistance(0.123)).toBe('123 m');
    });

    it('should format distance 1-10km with 1 decimal', () => {
      expect(formatDistance(2.34)).toBe('2.3 km');
    });

    it('should format distance >= 10km as rounded integer', () => {
      expect(formatDistance(15.7)).toBe('16 km');
    });

    it('should handle exactly 1km', () => {
      expect(formatDistance(1.0)).toBe('1.0 km');
    });

    it('should handle exactly 10km', () => {
      expect(formatDistance(10.0)).toBe('10 km');
    });

    it('should handle very small distances', () => {
      expect(formatDistance(0.01)).toBe('10 m');
    });
  });

  describe('formatDistanceMiles', () => {
    it('should format small distance in yards', () => {
      // 0.1 km = 0.0621 miles < 0.1 → yards
      expect(formatDistanceMiles(0.1)).toMatch(/\d+ yards/);
    });

    it('should format distance < 10 miles with 1 decimal', () => {
      // 5 km = ~3.1 miles
      expect(formatDistanceMiles(5)).toBe('3.1 miles');
    });

    it('should format distance >= 10 miles as rounded integer', () => {
      // 20 km = ~12.4 miles
      expect(formatDistanceMiles(20)).toBe('12 miles');
    });

    it('should convert 1.6 km to approximately 1.0 miles', () => {
      const result = formatDistanceMiles(1.6);
      expect(result).toBe('1.0 miles');
    });

    it('should handle 0 km', () => {
      expect(formatDistanceMiles(0)).toBe('0 yards');
    });
  });

  describe('sortByDistance', () => {
    const items = [
      { id: 'far', latitude: 53.0, longitude: 1.0 },
      { id: 'near', latitude: 52.76, longitude: 0.4 },
      { id: 'mid', latitude: 52.85, longitude: 0.6 },
    ];

    it('should sort items by distance from user (nearest first)', () => {
      // User at Kings Lynn: 52.7541, 0.3987
      const sorted = sortByDistance(items, 52.7541, 0.3987);
      expect(sorted[0].id).toBe('near');
      expect(sorted[1].id).toBe('mid');
      expect(sorted[2].id).toBe('far');
    });

    it('should add distance property to each item', () => {
      const sorted = sortByDistance(items, 52.7541, 0.3987);
      sorted.forEach((item) => {
        expect(item).toHaveProperty('distance');
        expect(typeof item.distance).toBe('number');
        expect(item.distance).toBeGreaterThanOrEqual(0);
      });
    });

    it('should preserve original item properties', () => {
      const sorted = sortByDistance(items, 52.7541, 0.3987);
      sorted.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('latitude');
        expect(item).toHaveProperty('longitude');
      });
    });

    it('should handle empty array', () => {
      const sorted = sortByDistance([], 52.7541, 0.3987);
      expect(sorted).toEqual([]);
    });

    it('should handle single item', () => {
      const single = [{ id: 'only', latitude: 52.0, longitude: 0.5 }];
      const sorted = sortByDistance(single, 52.7541, 0.3987);
      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('only');
    });
  });
});
