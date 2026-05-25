<script setup>
defineProps({
  employeeCode: { type: String, required: true },
});

const emit = defineEmits(['delete']);
</script>

<template>
  <div class="table-actions" :data-testid="`employee-row-actions-${employeeCode}`">
    <RouterLink
      :to="{ name: 'employee-details', params: { code: employeeCode } }"
      class="button button-secondary button-small"
      :data-testid="`employee-row-view-${employeeCode}`"
    >
      View
    </RouterLink>
    <RouterLink
      :to="{ name: 'edit-employee', params: { code: employeeCode } }"
      class="button button-secondary button-small"
      :data-testid="`employee-row-edit-${employeeCode}`"
    >
      Edit
    </RouterLink>
    <button
      type="button"
      class="button button-danger button-small"
      :data-testid="`employee-row-delete-${employeeCode}`"
      @click="emit('delete', employeeCode)"
    >
      Delete
    </button>
  </div>
</template>
