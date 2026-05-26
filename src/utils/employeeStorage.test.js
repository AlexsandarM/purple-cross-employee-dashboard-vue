import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearEmployeesStorage,
  readEmployeesFromStorage,
  writeEmployeesToStorage,
} from './employeeStorage';

const STORAGE_KEY = 'purple-cross:employees';

const sampleEmployees = [
  {
    code: 'EMP100',
    fullName: 'Test User',
    occupation: 'QA',
    department: 'IT',
    dateOfEmployment: '2021-01-01',
    terminationDate: null,
  },
];

describe('employeeStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when storage is empty', () => {
    expect(readEmployeesFromStorage()).toBeNull();
  });

  it('persists and reads a valid employee collection', () => {
    writeEmployeesToStorage(sampleEmployees);

    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(sampleEmployees));
    expect(readEmployeesFromStorage()).toEqual(sampleEmployees);
  });

  it('returns null when stored JSON is malformed', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json');

    expect(readEmployeesFromStorage()).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it('returns null when stored JSON is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: 'EMP100' }));

    expect(readEmployeesFromStorage()).toBeNull();
  });

  it('ignores writes that are not employee arrays', () => {
    writeEmployeesToStorage({ code: 'EMP100' });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('clears persisted employees', () => {
    writeEmployeesToStorage(sampleEmployees);
    clearEmployeesStorage();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(readEmployeesFromStorage()).toBeNull();
  });
});
