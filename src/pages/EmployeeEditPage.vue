<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '../components/common/PageHeader.vue';
import EmployeeForm from '../components/employees/EmployeeForm.vue';
import { useEmployees } from '../composables/useEmployees';
import { validateEmployee } from '../utils/employeeValidation';

const route = useRoute();
const router = useRouter();
const { employees, getEmployeeByCode, updateEmployee } = useEmployees();
const submitError = ref('');

const employee = computed(() =>
  route.params.code ? getEmployeeByCode(route.params.code) : null
);

const detailsPath = computed(() =>
  employee.value
    ? { name: 'employee-details', params: { code: employee.value.code } }
    : { name: 'employees' }
);

function handleCancel() {
  router.push(detailsPath.value);
}

function handleUpdateEmployee(formValues) {
  if (!employee.value) {
    return { errors: { code: 'Employee not found.' } };
  }

  const { errors, normalized } = validateEmployee(formValues, employees.value, {
    currentCode: employee.value.code,
  });

  if (Object.keys(errors).length > 0) {
    submitError.value = '';
    return { errors };
  }

  const updated = updateEmployee(employee.value.code, normalized);
  if (!updated) {
    submitError.value = 'Unable to save changes. Please try again.';
    return {
      errors: { code: 'Unable to update employee. Please try again.' },
    };
  }

  submitError.value = '';
  router.push({
    ...detailsPath.value,
    state: {
      toast: {
        message: `${normalized.fullName} was updated successfully.`,
        variant: 'success',
      },
    },
  });
  return {};
}
</script>

<template>
  <section v-if="!employee" class="page">
    <PageHeader
      title="Edit Employee"
      subtitle="The employee record you are trying to edit was not found."
    />
    <div class="card" data-testid="edit-employee-not-found">Employee not found.</div>
    <div class="row-actions">
      <RouterLink
        :to="{ name: 'employees' }"
        class="button button-secondary"
        data-testid="edit-employee-not-found-back-button"
      >
        Back to Employees
      </RouterLink>
    </div>
  </section>

  <section v-else class="page">
    <PageHeader
      :title="`Edit Employee: ${employee.fullName}`"
      subtitle="Update employee profile fields and save your changes."
    />
    <EmployeeForm
      :initial-values="employee"
      :on-submit="handleUpdateEmployee"
      submit-label="Save Changes"
      submit-test-id="edit-employee-save-button"
      disable-code-field
      code-read-only-message="Code is locked to prevent identity conflicts."
      :form-error="submitError"
      @cancel="handleCancel"
    />
  </section>
</template>
