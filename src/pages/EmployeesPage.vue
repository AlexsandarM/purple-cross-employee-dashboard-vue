<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConfirmDialog from '../components/common/ConfirmDialog.vue';
import PageHeader from '../components/common/PageHeader.vue';
import ToastMessage from '../components/common/ToastMessage.vue';
import EmployeeFilters from '../components/employees/EmployeeFilters.vue';
import EmployeeTable from '../components/employees/EmployeeTable.vue';
import { useEmployees } from '../composables/useEmployees';
import { APP_PATHS } from '../routes/paths';

const route = useRoute();
const router = useRouter();
const { employees, deleteEmployee, resetEmployees } = useEmployees();

const searchTerm = ref('');
const departmentFilter = ref('');
const occupationFilter = ref('');
const employeePendingDeleteCode = ref('');
const toast = ref(null);

onMounted(() => {
  applyRouteToast();
});

watch(
  () => route.fullPath,
  () => {
    applyRouteToast();
  }
);

function applyRouteToast() {
  const locationToast = history.state?.toast;
  if (!locationToast?.message) {
    return;
  }

  toast.value = locationToast;
  router.replace({ path: route.path, state: {} });
}

watch(toast, (value, _, onCleanup) => {
  if (!value) {
    return;
  }

  const timeoutId = window.setTimeout(() => {
    toast.value = null;
  }, 3500);

  onCleanup(() => window.clearTimeout(timeoutId));
});

const departmentOptions = computed(() =>
  [...new Set(employees.value.map((employee) => employee.department))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
);

const occupationOptions = computed(() =>
  [...new Set(employees.value.map((employee) => employee.occupation))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
);

const filteredEmployees = computed(() => {
  const normalizedSearchTerm = searchTerm.value.trim().toLowerCase();

  return employees.value.filter((employee) => {
    const matchesDepartment =
      !departmentFilter.value || employee.department === departmentFilter.value;
    const matchesOccupation =
      !occupationFilter.value || employee.occupation === occupationFilter.value;

    if (!matchesDepartment || !matchesOccupation) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    const searchable = [
      employee.code,
      employee.fullName,
      employee.department,
      employee.occupation,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedSearchTerm);
  });
});

const pendingDeleteEmployee = computed(
  () =>
    employees.value.find((employee) => employee.code === employeePendingDeleteCode.value) ??
    null
);

function handleDeleteEmployee(code) {
  employeePendingDeleteCode.value = code;
}

function handleCancelDelete() {
  employeePendingDeleteCode.value = '';
}

function handleConfirmDelete() {
  if (!employeePendingDeleteCode.value) {
    return;
  }

  const deleted = deleteEmployee(employeePendingDeleteCode.value);
  if (deleted) {
    toast.value = { message: 'Employee deleted successfully.', variant: 'success' };
  } else {
    toast.value = {
      message: 'Unable to delete employee. Please try again.',
      variant: 'error',
    };
  }
  employeePendingDeleteCode.value = '';
}

function handleClearFilters() {
  searchTerm.value = '';
  departmentFilter.value = '';
  occupationFilter.value = '';
}

function handleResetData() {
  resetEmployees();
  handleClearFilters();
  toast.value = {
    message: 'Employee data reset to initial dataset.',
    variant: 'info',
  };
}
</script>

<template>
  <section class="page">
    <PageHeader
      title="Employee Management"
      subtitle="Centralized employee directory and actions."
    >
      <template #actions>
        <div class="page-actions">
          <button
            type="button"
            class="button button-secondary"
            data-testid="employees-reset-button"
            @click="handleResetData"
          >
            Reset Data
          </button>
          <RouterLink
            :to="APP_PATHS.createEmployee"
            class="button button-primary"
            data-testid="employees-create-button"
          >
            Create Employee
          </RouterLink>
        </div>
      </template>
    </PageHeader>

    <EmployeeFilters
      v-model:search-term="searchTerm"
      v-model:department-filter="departmentFilter"
      v-model:occupation-filter="occupationFilter"
      :department-options="departmentOptions"
      :occupation-options="occupationOptions"
      @clear-filters="handleClearFilters"
    />

    <EmployeeTable
      :employees="filteredEmployees"
      empty-state-message="No employees match the selected filters."
      @delete="handleDeleteEmployee"
    />

    <ConfirmDialog
      :open="Boolean(employeePendingDeleteCode)"
      title="Delete employee?"
      :message="
        pendingDeleteEmployee
          ? `Are you sure you want to delete ${pendingDeleteEmployee.fullName}?`
          : 'Are you sure you want to delete this employee?'
      "
      confirm-label="Delete"
      cancel-label="Cancel"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />

    <ToastMessage :toast="toast" @close="toast = null" />
  </section>
</template>
