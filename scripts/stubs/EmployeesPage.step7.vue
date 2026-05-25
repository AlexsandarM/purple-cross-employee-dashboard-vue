<script setup>
import { computed } from 'vue';
import PageHeader from '../components/common/PageHeader.vue';
import EmployeeTable from '../components/employees/EmployeeTable.vue';
import { useEmployees } from '../composables/useEmployees';
import { APP_PATHS } from '../routes/paths';

const { employees, resetEmployees } = useEmployees();

const filteredEmployees = computed(() => employees.value);

function handleResetData() {
  resetEmployees();
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

    <EmployeeTable
      :employees="filteredEmployees"
      empty-state-message="No employees match the selected filters."
      @delete="() => {}"
    />
  </section>
</template>
