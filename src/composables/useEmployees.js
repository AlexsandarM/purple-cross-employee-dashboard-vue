import { inject, provide, ref, watch } from 'vue';
import initialEmployees from '../data/employees.json';
import {
  clearEmployeesStorage,
  readEmployeesFromStorage,
  writeEmployeesToStorage,
} from '../utils/employeeStorage';

const EMPLOYEES_KEY = Symbol('employees');

function cloneEmployees(employees) {
  return employees.map((employee) => ({ ...employee }));
}

function getInitialEmployees() {
  const storedEmployees = readEmployeesFromStorage();
  if (storedEmployees) {
    return storedEmployees;
  }

  return cloneEmployees(initialEmployees);
}

function createEmployeesState() {
  const employees = ref(getInitialEmployees());

  watch(
    employees,
    (value) => {
      writeEmployeesToStorage(value);
    },
    { deep: true }
  );

  function getEmployeeByCode(code) {
    return employees.value.find((employee) => employee.code === code) ?? null;
  }

  function createEmployee(newEmployee) {
    const alreadyExists = employees.value.some(
      (employee) => employee.code === newEmployee.code
    );

    if (alreadyExists) {
      return false;
    }

    employees.value = [newEmployee, ...employees.value];
    return true;
  }

  function updateEmployee(code, updatedEmployee) {
    const index = employees.value.findIndex((employee) => employee.code === code);
    if (index === -1) {
      return false;
    }

    const next = [...employees.value];
    next[index] = { ...next[index], ...updatedEmployee };
    employees.value = next;
    return true;
  }

  function deleteEmployee(code) {
    const nextEmployees = employees.value.filter((employee) => employee.code !== code);
    const deleted = nextEmployees.length !== employees.value.length;
    employees.value = nextEmployees;
    return deleted;
  }

  function resetEmployees() {
    clearEmployeesStorage();
    employees.value = cloneEmployees(initialEmployees);
  }

  return {
    employees,
    getEmployeeByCode,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployees,
  };
}

export function provideEmployees() {
  const state = createEmployeesState();
  provide(EMPLOYEES_KEY, state);
  return state;
}

export function useEmployees() {
  const context = inject(EMPLOYEES_KEY);
  if (!context) {
    throw new Error('useEmployees must be used after provideEmployees in App.');
  }

  return context;
}
