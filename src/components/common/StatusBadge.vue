<script setup>
import { computed } from 'vue';
import { getStatusVariant } from '../../utils/employeeStatus';

const props = defineProps({
  status: { type: String, required: true },
  testId: { type: String, default: '' },
});

const variant = computed(() => getStatusVariant(props.status));
</script>

<template>
  <span
    :class="['status-badge', `status-${variant}`]"
    :data-testid="testId ? testId : undefined"
  >
    {{ status }}
  </span>
</template>
