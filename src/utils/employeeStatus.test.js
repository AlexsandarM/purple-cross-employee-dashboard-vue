import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getEmploymentStatus,
  getStatusVariant,
  getTerminationStatus,
} from './employeeStatus';

const TODAY = new Date('2026-05-25');

describe('employeeStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getEmploymentStatus', () => {
    it.each([
      ['', 'Unknown'],
      ['not-a-date', 'Unknown'],
      ['2026-06-01', 'Employed soon'],
      ['2026-05-24', 'Currently employed'],
      ['2020-01-01', 'Currently employed'],
    ])('maps employment date %j to %s', (input, expected) => {
      expect(getEmploymentStatus(input)).toBe(expected);
    });
  });

  describe('getTerminationStatus', () => {
    it.each([
      [null, 'Active'],
      ['', 'Active'],
      ['2026-12-01', 'To be terminated'],
      ['2026-05-24', 'Terminated'],
      ['2020-10-28', 'Terminated'],
    ])('maps termination date %j to %s', (input, expected) => {
      expect(getTerminationStatus(input)).toBe(expected);
    });
  });

  describe('getStatusVariant', () => {
    it.each([
      ['Currently employed', 'positive'],
      ['Active', 'positive'],
      ['Employed soon', 'warning'],
      ['To be terminated', 'warning'],
      ['Terminated', 'negative'],
      ['Unknown', 'neutral'],
    ])('maps status %s to variant %s', (status, variant) => {
      expect(getStatusVariant(status)).toBe(variant);
    });
  });
});
