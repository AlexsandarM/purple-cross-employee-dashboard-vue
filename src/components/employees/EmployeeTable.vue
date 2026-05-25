<script setup>
import { computed, ref, watch } from 'vue';
import StatusBadge from '../common/StatusBadge.vue';
import EmployeeTableActions from './EmployeeTableActions.vue';
import { formatDate, compareDateValues } from '../../utils/dateUtils';
import {
  getEmploymentStatus,
  getTerminationStatus,
} from '../../utils/employeeStatus';

const PAGE_SIZE = 10;
const DEFAULT_SORT = { column: 'fullName', direction: 'asc' };

const props = defineProps({
  employees: { type: Array, required: true },
  emptyStateMessage: { type: String, default: 'No employees available.' },
});

const emit = defineEmits(['delete']);

const sortState = ref({ ...DEFAULT_SORT });
const currentPage = ref(1);

function compareByColumn(a, b, column) {
  if (column === 'dateOfEmployment' || column === 'terminationDate') {
    return compareDateValues(a[column], b[column]);
  }

  const left = (a[column] ?? '').toString().toLowerCase();
  const right = (b[column] ?? '').toString().toLowerCase();

  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function getNextSortState(current, column) {
  if (current.column !== column) {
    return { column, direction: 'asc' };
  }

  return {
    column,
    direction: current.direction === 'asc' ? 'desc' : 'asc',
  };
}

const sortedEmployees = computed(() => {
  const sorted = [...props.employees];
  sorted.sort((a, b) => compareByColumn(a, b, sortState.value.column));

  if (sortState.value.direction === 'desc') {
    sorted.reverse();
  }

  return sorted;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedEmployees.value.length / PAGE_SIZE))
);

const safePage = computed(() => Math.min(currentPage.value, totalPages.value));

const pagedEmployees = computed(() => {
  const pageStart = (safePage.value - 1) * PAGE_SIZE;
  return sortedEmployees.value.slice(pageStart, pageStart + PAGE_SIZE);
});

watch(
  () => props.employees.length,
  () => {
    currentPage.value = 1;
  }
);

function handleSort(column) {
  sortState.value = getNextSortState(sortState.value, column);
  currentPage.value = 1;
}

function goToPreviousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1);
}

function goToNextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
}
</script>

<template>
  <div v-if="!employees.length" class="card" data-testid="employees-empty-state">
    {{ emptyStateMessage }}
  </div>

  <div v-else class="card" data-testid="employees-table-card">
    <div class="table-scroll">
      <table class="employee-table" data-testid="employee-table">
        <thead>
          <tr>
            <th>
              <button type="button" class="sort-button" data-testid="employee-sort-full-name" @click="handleSort('fullName')">Full Name</button>
            </th>
            <th>
              <button type="button" class="sort-button" data-testid="employee-sort-occupation" @click="handleSort('occupation')">Occupation</button>
            </th>
            <th>
              <button type="button" class="sort-button" data-testid="employee-sort-department" @click="handleSort('department')">Department</button>
            </th>
            <th>
              <button type="button" class="sort-button" data-testid="employee-sort-date-of-employment" @click="handleSort('dateOfEmployment')">Date of Employment</button>
            </th>
            <th>Employment Status</th>
            <th>
              <button type="button" class="sort-button" data-testid="employee-sort-termination-date" @click="handleSort('terminationDate')">Termination Date</button>
            </th>
            <th>Termination Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in pagedEmployees" :key="employee.code" :data-testid="`employee-table-row-${employee.code}`">
            <td :data-testid="`employee-row-full-name-${employee.code}`">{{ employee.fullName }}</td>
            <td :data-testid="`employee-row-occupation-${employee.code}`">{{ employee.occupation }}</td>
            <td :data-testid="`employee-row-department-${employee.code}`">{{ employee.department }}</td>
            <td :data-testid="`employee-row-date-of-employment-${employee.code}`">{{ formatDate(employee.dateOfEmployment) }}</td>
            <td>
              <StatusBadge :status="getEmploymentStatus(employee.dateOfEmployment)" :test-id="`employee-row-employment-status-${employee.code}`" />
            </td>
            <td :data-testid="`employee-row-termination-date-${employee.code}`">{{ formatDate(employee.terminationDate) }}</td>
            <td>
              <StatusBadge :status="getTerminationStatus(employee.terminationDate)" :test-id="`employee-row-termination-status-${employee.code}`" />
            </td>
            <td>
              <EmployeeTableActions :employee-code="employee.code" @delete="emit('delete', $event)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer" data-testid="employee-table-pagination">
      <p>Showing {{ pagedEmployees.length }} of {{ employees.length }} employees.</p>
      <div class="row-actions">
        <button type="button" class="button button-secondary button-small" :disabled="safePage === 1" data-testid="employee-pagination-previous" @click="goToPreviousPage">Previous</button>
        <span data-testid="employee-pagination-page-indicator">Page {{ safePage }} of {{ totalPages }}</span>
        <button type="button" class="button button-secondary button-small" :disabled="safePage === totalPages" data-testid="employee-pagination-next" @click="goToNextPage">Next</button>
      </div>
    </div>
  </div>
</template>
