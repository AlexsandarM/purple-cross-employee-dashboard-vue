import { describe, expect, it } from 'vitest';
import {
  compareDateValues,
  formatDate,
  startOfDay,
  toDateOrNull,
} from './dateUtils';

describe('dateUtils', () => {
  describe('toDateOrNull', () => {
    it.each([
      ['empty string', '', null],
      ['null', null, null],
      ['invalid string', 'not-a-date', null],
      ['valid ISO date', '2022-06-15', expect.any(Date)],
    ])('returns expected value for %s', (_label, input, expected) => {
      const result = toDateOrNull(input);
      if (expected === null) {
        expect(result).toBeNull();
      } else {
        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).not.toBeNaN();
      }
    });
  });

  describe('startOfDay', () => {
    it('strips the time portion from a date', () => {
      const input = new Date('2024-08-10T15:30:00');
      const result = startOfDay(input);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('compareDateValues', () => {
    it.each([
      ['both empty', '', '', 0],
      ['first empty sorts after second', '', '2020-01-01', 1],
      ['second empty sorts before first', '2020-01-01', '', -1],
      ['earlier date first', '2019-01-01', '2020-01-01', expect.any(Number)],
    ])('%s', (_label, first, second, expectedSign) => {
      const result = compareDateValues(first, second);

      if (expectedSign === 0) {
        expect(result).toBe(0);
      } else if (expectedSign === 1) {
        expect(result).toBeGreaterThan(0);
      } else if (expectedSign === -1) {
        expect(result).toBeLessThan(0);
      } else {
        expect(result).toBeLessThan(0);
      }
    });

    it('returns a negative value when the first date is earlier', () => {
      expect(compareDateValues('2018-01-01', '2019-01-01')).toBeLessThan(0);
      expect(compareDateValues('2019-01-01', '2018-01-01')).toBeGreaterThan(0);
    });
  });

  describe('formatDate', () => {
    it('returns N/A for missing or invalid values', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
      expect(formatDate('invalid')).toBe('N/A');
    });

    it('formats a valid date using en-GB locale', () => {
      expect(formatDate('2020-03-15')).toBe('15 Mar 2020');
    });
  });
});
