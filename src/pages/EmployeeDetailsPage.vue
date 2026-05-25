<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHeader from '../components/common/PageHeader.vue';
import ToastMessage from '../components/common/ToastMessage.vue';
import EmployeeDetailsCard from '../components/employees/EmployeeDetailsCard.vue';
import { useEmployees } from '../composables/useEmployees';

const route = useRoute();
const router = useRouter();
const { getEmployeeByCode } = useEmployees();
const toast = ref(null);

const employee = computed(() =>
  route.params.code ? getEmployeeByCode(route.params.code) : null
);

const editPath = computed(() =>
  employee.value
    ? { name: 'edit-employee', params: { code: employee.value.code } }
    : { name: 'employees' }
);

function applyRouteToast() {
  const locationToast = history.state?.toast;
  if (!locationToast?.message) {
    return;
  }

  toast.value = locationToast;
  router.replace({ path: route.path, state: {} });
}

onMounted(applyRouteToast);

watch(() => route.fullPath, applyRouteToast);

watch(toast, (value, _, onCleanup) => {
  if (!value) {
    return;
  }

  const timeoutId = window.setTimeout(() => {
    toast.value = null;
  }, 3500);

  onCleanup(() => window.clearTimeout(timeoutId));
});
</script>

<template>
  <section v-if="!employee" class="page">
    <PageHeader
      title="Employee Details"
      subtitle="The requested employee profile could not be found."
    />
    <div class="card" data-testid="employee-details-not-found">Employee not found.</div>
    <div class="row-actions">
      <RouterLink
        :to="{ name: 'employees' }"
        class="button button-secondary"
        data-testid="employee-details-not-found-back-button"
      >
        Back to Employees
      </RouterLink>
    </div>
  </section>

  <section v-else class="page">
    <PageHeader
      :title="`Employee Details: ${employee.fullName}`"
      subtitle="Profile details and current status overview."
    />
    <EmployeeDetailsCard :employee="employee" />
    <div class="row-actions">
      <RouterLink
        :to="{ name: 'employees' }"
        class="button button-secondary"
        data-testid="employee-details-back-button"
      >
        Back
      </RouterLink>
      <RouterLink
        :to="editPath"
        class="button button-primary"
        data-testid="employee-details-edit-button"
      >
        Edit
      </RouterLink>
    </div>
    <ToastMessage :toast="toast" @close="toast = null" />
  </section>
</template>
