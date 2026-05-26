import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideEmployees, useEmployees } from './useEmployees';

const seedEmployees = [
  {
    code: 'EMP001',
    fullName: 'Jane Doe',
    occupation: 'Nurse',
    department: 'Clinical',
    dateOfEmployment: '2019-01-01',
    terminationDate: null,
  },
  {
    code: 'EMP002',
    fullName: 'John Smith',
    occupation: 'Pharmacist',
    department: 'Logistics',
    dateOfEmployment: '2020-05-01',
    terminationDate: null,
  },
];

vi.mock('../utils/employeeStorage.js', () => ({
  readEmployeesFromStorage: vi.fn(() => structuredClone(seedEmployees)),
  writeEmployeesToStorage: vi.fn(),
  clearEmployeesStorage: vi.fn(),
}));

function mountEmployeesContext() {
  let context;

  const Consumer = defineComponent({
    setup() {
      context = useEmployees();
      return () => null;
    },
  });

  mount(
    defineComponent({
      setup() {
        provideEmployees();
        return () => h(Consumer);
      },
    })
  );

  return () => context;
}

describe('useEmployees', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when used outside provideEmployees', () => {
    const Orphan = defineComponent({
      setup() {
        useEmployees();
        return () => null;
      },
    });

    expect(() => mount(Orphan)).toThrow(
      'useEmployees must be used after provideEmployees in App.'
    );
  });

  it('loads seeded employees and finds by code', () => {
    const getContext = mountEmployeesContext();
    const { employees, getEmployeeByCode } = getContext();

    expect(employees.value).toHaveLength(2);
    expect(getEmployeeByCode('EMP001')?.fullName).toBe('Jane Doe');
    expect(getEmployeeByCode('EMP999')).toBeNull();
  });

  it('creates a new employee at the top of the list', async () => {
    const getContext = mountEmployeesContext();
    const { createEmployee, employees } = getContext();

    const created = createEmployee({
      code: 'EMP003',
      fullName: 'New Hire',
      occupation: 'Support',
      department: 'IT',
      dateOfEmployment: '2024-01-01',
      terminationDate: null,
    });

    await nextTick();

    expect(created).toBe(true);
    expect(employees.value[0].code).toBe('EMP003');
    expect(employees.value).toHaveLength(3);
  });

  it('rejects creating an employee with a duplicate code', () => {
    const getContext = mountEmployeesContext();
    const { createEmployee, employees } = getContext();

    const created = createEmployee({
      code: 'EMP001',
      fullName: 'Duplicate',
      occupation: 'Admin',
      department: 'HR',
      dateOfEmployment: '2024-01-01',
      terminationDate: null,
    });

    expect(created).toBe(false);
    expect(employees.value).toHaveLength(2);
  });

  it('updates and deletes an employee by code', async () => {
    const getContext = mountEmployeesContext();
    const { updateEmployee, deleteEmployee, getEmployeeByCode, employees } = getContext();

    expect(updateEmployee('EMP002', { department: 'Research' })).toBe(true);
    expect(getEmployeeByCode('EMP002')?.department).toBe('Research');

    expect(deleteEmployee('EMP001')).toBe(true);
    await nextTick();

    expect(employees.value).toHaveLength(1);
    expect(getEmployeeByCode('EMP001')).toBeNull();
    expect(deleteEmployee('EMP404')).toBe(false);
  });
});
