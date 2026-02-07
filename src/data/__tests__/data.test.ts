import { mockProperties } from '../mockProperties';
import { mockWasteItems } from '../mockWasteItems';
import { mockRecyclingCentres } from '../mockRecyclingCentres';
import { BinType } from '../../types';

describe('mockProperties data', () => {
  it('should have at least 1 property', () => {
    expect(mockProperties.length).toBeGreaterThan(0);
  });

  it('should have unique IDs', () => {
    const ids = mockProperties.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every property should have all required fields', () => {
    mockProperties.forEach((property) => {
      expect(property.id).toBeTruthy();
      expect(property.postcode).toBeTruthy();
      expect(property.address).toBeTruthy();
      expect(typeof property.rubbishDayOfWeek).toBe('number');
      expect(typeof property.recyclingDayOfWeek).toBe('number');
      expect(typeof property.gardenDayOfWeek).toBe('number');
      expect(typeof property.foodDayOfWeek).toBe('number');
    });
  });

  it('day-of-week values should be 0-6', () => {
    mockProperties.forEach((property) => {
      [
        property.rubbishDayOfWeek,
        property.recyclingDayOfWeek,
        property.gardenDayOfWeek,
        property.foodDayOfWeek,
      ].forEach((day) => {
        expect(day).toBeGreaterThanOrEqual(0);
        expect(day).toBeLessThanOrEqual(6);
      });
    });
  });

  it('postcodes should match West Norfolk area format', () => {
    const validPrefixes = ['PE30', 'PE31', 'PE32', 'PE33', 'PE34', 'PE35', 'PE36', 'PE37', 'PE38', 'NR21'];
    mockProperties.forEach((property) => {
      const prefix = property.postcode.split(' ')[0];
      expect(validPrefixes).toContain(prefix);
    });
  });
});

describe('mockWasteItems data', () => {
  it('should have at least 50 waste items', () => {
    expect(mockWasteItems.length).toBeGreaterThanOrEqual(50);
  });

  it('should have unique IDs', () => {
    const ids = mockWasteItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every item should have all required fields', () => {
    mockWasteItems.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(Object.values(BinType)).toContain(item.binType);
      expect(item.notes).toBeTruthy();
      expect(Array.isArray(item.keywords)).toBe(true);
    });
  });

  it('every item should have at least one keyword', () => {
    mockWasteItems.forEach((item) => {
      expect(item.keywords.length).toBeGreaterThan(0);
    });
  });

  it('should cover all bin types', () => {
    const binTypes = new Set(mockWasteItems.map((item) => item.binType));
    expect(binTypes.has(BinType.GENERAL)).toBe(true);
    expect(binTypes.has(BinType.RECYCLING)).toBe(true);
    expect(binTypes.has(BinType.GARDEN)).toBe(true);
    expect(binTypes.has(BinType.FOOD)).toBe(true);
    expect(binTypes.has(BinType.RECYCLING_CENTRE)).toBe(true);
  });

  it('keywords should all be non-empty strings', () => {
    mockWasteItems.forEach((item) => {
      item.keywords.forEach((kw) => {
        expect(typeof kw).toBe('string');
        expect(kw.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

describe('mockRecyclingCentres data', () => {
  it('should have at least 1 centre', () => {
    expect(mockRecyclingCentres.length).toBeGreaterThan(0);
  });

  it('should have unique IDs', () => {
    const ids = mockRecyclingCentres.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every centre should have all required fields', () => {
    mockRecyclingCentres.forEach((centre) => {
      expect(centre.id).toBeTruthy();
      expect(centre.name).toBeTruthy();
      expect(centre.address).toBeTruthy();
      expect(typeof centre.latitude).toBe('number');
      expect(typeof centre.longitude).toBe('number');
      expect(centre.openingHours).toBeTruthy();
      expect(centre.notes).toBeTruthy();
      expect(Array.isArray(centre.materialsAccepted)).toBe(true);
      expect(centre.phoneNumber).toBeTruthy();
    });
  });

  it('coordinates should be in Norfolk area', () => {
    mockRecyclingCentres.forEach((centre) => {
      // Norfolk is roughly lat 52.3-53.0, lon 0.3-1.8
      expect(centre.latitude).toBeGreaterThan(52.0);
      expect(centre.latitude).toBeLessThan(53.5);
      expect(centre.longitude).toBeGreaterThan(-0.5);
      expect(centre.longitude).toBeLessThan(2.0);
    });
  });

  it('every centre should accept at least one material', () => {
    mockRecyclingCentres.forEach((centre) => {
      expect(centre.materialsAccepted.length).toBeGreaterThan(0);
    });
  });

  it('phone numbers should be valid UK format', () => {
    mockRecyclingCentres.forEach((centre) => {
      expect(centre.phoneNumber).toMatch(/^0\d{3,4}\s?\d{3}\s?\d{4}$/);
    });
  });

  it('opening hours should be non-empty strings', () => {
    mockRecyclingCentres.forEach((centre) => {
      expect(typeof centre.openingHours).toBe('string');
      expect(centre.openingHours.length).toBeGreaterThan(0);
    });
  });
});
