import {
  getNextCollectionDate,
  formatDate,
  formatDayName,
  getDaysUntil,
  formatDaysUntil,
  isToday,
  isTomorrow,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('getNextCollectionDate', () => {
    // The 7:01 AM cutoff: before 7:01 shows today's collection, at/after 7:01 shows next week
    describe('7:01 AM cutoff rule', () => {
      it('should return today if collection day is today and time is before 7:01 AM (midnight)', () => {
        // Monday at midnight
        const monday = new Date(2026, 1, 9, 0, 0, 0); // Mon Feb 9 2026 00:00
        const result = getNextCollectionDate(1, monday); // dayOfWeek=1 (Monday)
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(9); // Same day
      });

      it('should return today if collection day is today and time is 6:59 AM', () => {
        const monday = new Date(2026, 1, 9, 6, 59, 0);
        const result = getNextCollectionDate(1, monday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(9); // Same day
      });

      it('should return today if collection day is today and time is 7:00 AM exactly', () => {
        const monday = new Date(2026, 1, 9, 7, 0, 0);
        const result = getNextCollectionDate(1, monday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(9); // Same day — 7:00 is still before cutoff
      });

      it('should return next week if collection day is today and time is 7:01 AM', () => {
        const monday = new Date(2026, 1, 9, 7, 1, 0);
        const result = getNextCollectionDate(1, monday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(16); // Next Monday
      });

      it('should return next week if collection day is today and time is 7:02 AM', () => {
        const monday = new Date(2026, 1, 9, 7, 2, 0);
        const result = getNextCollectionDate(1, monday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(16); // Next Monday
      });

      it('should return next week if collection day is today and time is afternoon', () => {
        const monday = new Date(2026, 1, 9, 15, 30, 0);
        const result = getNextCollectionDate(1, monday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(16); // Next Monday
      });

      it('should return next week if collection day is today and time is 11:59 PM', () => {
        const monday = new Date(2026, 1, 9, 23, 59, 0);
        const result = getNextCollectionDate(1, monday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(16); // Next Monday
      });
    });

    describe('collection day in the future this week', () => {
      it('should return upcoming day this week', () => {
        // Monday, asking for Wednesday (dayOfWeek=3)
        const monday = new Date(2026, 1, 9, 10, 0, 0);
        const result = getNextCollectionDate(3, monday);
        expect(result.getDay()).toBe(3); // Wednesday
        expect(result.getDate()).toBe(11); // Feb 11 2026
      });

      it('should return Friday when asking from Monday', () => {
        const monday = new Date(2026, 1, 9, 8, 0, 0);
        const result = getNextCollectionDate(5, monday);
        expect(result.getDay()).toBe(5);
        expect(result.getDate()).toBe(13);
      });
    });

    describe('collection day already passed this week', () => {
      it('should return next week if collection day was earlier this week', () => {
        // Thursday (Feb 12), asking for Monday (dayOfWeek=1)
        const thursday = new Date(2026, 1, 12, 10, 0, 0);
        const result = getNextCollectionDate(1, thursday);
        expect(result.getDay()).toBe(1);
        expect(result.getDate()).toBe(16); // Next Monday
      });

      it('should return next week when day passed (Wednesday asking for Tuesday)', () => {
        const wednesday = new Date(2026, 1, 11, 12, 0, 0);
        const result = getNextCollectionDate(2, wednesday);
        expect(result.getDay()).toBe(2);
        expect(result.getDate()).toBe(17);
      });
    });

    describe('Sunday edge cases', () => {
      it('should handle Sunday (dayOfWeek=0) correctly from Monday', () => {
        const monday = new Date(2026, 1, 9, 10, 0, 0);
        const result = getNextCollectionDate(0, monday);
        expect(result.getDay()).toBe(0); // Sunday
        expect(result.getDate()).toBe(15);
      });

      it('should handle asking for Sunday on a Sunday before 7:01', () => {
        const sunday = new Date(2026, 1, 8, 6, 0, 0);
        const result = getNextCollectionDate(0, sunday);
        expect(result.getDay()).toBe(0);
        expect(result.getDate()).toBe(8); // Same Sunday
      });

      it('should handle asking for Sunday on a Sunday after 7:01', () => {
        const sunday = new Date(2026, 1, 8, 8, 0, 0);
        const result = getNextCollectionDate(0, sunday);
        expect(result.getDay()).toBe(0);
        expect(result.getDate()).toBe(15); // Next Sunday
      });
    });

    it('should always return a date with time set to midnight', () => {
      const date = new Date(2026, 1, 9, 15, 30, 45);
      const result = getNextCollectionDate(3, date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should default to current date when no fromDate provided', () => {
      const result = getNextCollectionDate(1); // Monday
      expect(result.getDay()).toBe(1);
      // Should be in the future or today
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      expect(result.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });
  });

  describe('formatDate', () => {
    it('should format a date as "Day DD Mon"', () => {
      const date = new Date(2026, 1, 9); // Mon Feb 9 2026
      expect(formatDate(date)).toBe('Mon 9 Feb');
    });

    it('should format different months correctly', () => {
      const date = new Date(2026, 11, 25); // Dec 25
      expect(formatDate(date)).toBe('Fri 25 Dec');
    });

    it('should handle January 1st', () => {
      const date = new Date(2026, 0, 1); // Jan 1
      expect(formatDate(date)).toBe('Thu 1 Jan');
    });

    it('should handle double-digit dates', () => {
      const date = new Date(2026, 2, 15); // Mar 15
      expect(formatDate(date)).toBe('Sun 15 Mar');
    });
  });

  describe('formatDayName', () => {
    it('should return full day name for Sunday', () => {
      const sunday = new Date(2026, 1, 8);
      expect(formatDayName(sunday)).toBe('Sunday');
    });

    it('should return full day name for Monday', () => {
      const monday = new Date(2026, 1, 9);
      expect(formatDayName(monday)).toBe('Monday');
    });

    it('should return full day name for Saturday', () => {
      const saturday = new Date(2026, 1, 14);
      expect(formatDayName(saturday)).toBe('Saturday');
    });

    it('should return correct name for all days of the week', () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      // Feb 8 2026 is a Sunday
      for (let i = 0; i < 7; i++) {
        const date = new Date(2026, 1, 8 + i);
        expect(formatDayName(date)).toBe(days[i]);
      }
    });
  });

  describe('getDaysUntil', () => {
    it('should return 0 for today', () => {
      const today = new Date(2026, 1, 9, 14, 0, 0);
      const target = new Date(2026, 1, 9, 8, 0, 0);
      expect(getDaysUntil(target, today)).toBe(0);
    });

    it('should return 1 for tomorrow', () => {
      const today = new Date(2026, 1, 9);
      const tomorrow = new Date(2026, 1, 10);
      expect(getDaysUntil(tomorrow, today)).toBe(1);
    });

    it('should return 7 for next week', () => {
      const today = new Date(2026, 1, 9);
      const nextWeek = new Date(2026, 1, 16);
      expect(getDaysUntil(nextWeek, today)).toBe(7);
    });

    it('should return negative for past dates', () => {
      const today = new Date(2026, 1, 9);
      const yesterday = new Date(2026, 1, 8);
      expect(getDaysUntil(yesterday, today)).toBe(-1);
    });

    it('should ignore time differences within the same day', () => {
      const morning = new Date(2026, 1, 9, 6, 0, 0);
      const evening = new Date(2026, 1, 9, 22, 0, 0);
      expect(getDaysUntil(evening, morning)).toBe(0);
    });

    it('should handle month boundaries', () => {
      const jan31 = new Date(2026, 0, 31);
      const feb1 = new Date(2026, 1, 1);
      expect(getDaysUntil(feb1, jan31)).toBe(1);
    });
  });

  describe('formatDaysUntil', () => {
    it('should return "Today!" for 0 days', () => {
      expect(formatDaysUntil(0)).toBe('Today!');
    });

    it('should return "Tomorrow!" for 1 day', () => {
      expect(formatDaysUntil(1)).toBe('Tomorrow!');
    });

    it('should return "In X days" for 2-6 days', () => {
      expect(formatDaysUntil(2)).toBe('In 2 days');
      expect(formatDaysUntil(3)).toBe('In 3 days');
      expect(formatDaysUntil(6)).toBe('In 6 days');
    });

    it('should return "In 1 week" for exactly 7 days', () => {
      expect(formatDaysUntil(7)).toBe('In 1 week');
    });

    it('should return "In X days" for more than 7 days', () => {
      expect(formatDaysUntil(8)).toBe('In 8 days');
      expect(formatDaysUntil(14)).toBe('In 14 days');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const now = new Date();
      expect(isToday(now)).toBe(true);
    });

    it('should return true regardless of time of day', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(isToday(today)).toBe(true);

      const tonight = new Date();
      tonight.setHours(23, 59, 59, 999);
      expect(isToday(tonight)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isTomorrow', () => {
    it('should return true for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isTomorrow(tomorrow)).toBe(true);
    });

    it('should return false for today', () => {
      const now = new Date();
      expect(isTomorrow(now)).toBe(false);
    });

    it('should return false for day after tomorrow', () => {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      expect(isTomorrow(dayAfter)).toBe(false);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isTomorrow(yesterday)).toBe(false);
    });
  });
});
