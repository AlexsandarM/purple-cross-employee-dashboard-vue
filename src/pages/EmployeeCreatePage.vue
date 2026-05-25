<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '../components/common/PageHeader.vue';
import EmployeeForm from '../components/employees/EmployeeForm.vue';
import { useEmployees } from '../composables/useEmployees';
import { APP_PATHS } from '../routes/paths';
import { validateEmployee } from '../utils/employeeValidation';

const router = useRouter();
const { employees, createEmployee } = useEmployees();
const submitError = ref('');

function handleCancel() {
  router.push(APP_PATHS.employees);
}

function handleCreateEmployee(formValues) {
  const { errors, normalized } = validateEmployee(formValues, employees.value);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const created = createEmployee(normalized);
  if (!created) {
    submitError.value = 'Employee code already exists.';
    return { errors: { code: 'Code must be unique.' } };
  }

  submitError.value = '';
  router.push({
    path: APP_PATHS.employees,
    state: {
      toast: {
        message: `${normalized.fullName} was created successfully.`,
        variant: 'success',
      },
    },
  });
  return {};
}
</script>

<template>
  <section class="page">
    <PageHeader
      title="Create Employee"
      subtitle="Add a new employee profile to the directory."
    />
    <EmployeeForm
      :on-submit="handleCreateEmployee"
      submit-label="Save Employee"
      submit-test-id="create-employee-save-button"
      :form-error="submitError"
      @cancel="handleCancel"
    />
  </section>
</template>
