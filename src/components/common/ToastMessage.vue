<script setup>
import { computed } from 'vue';

const props = defineProps({
  toast: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const variant = computed(() => props.toast?.variant ?? 'info');

const icon = computed(() => {
  const icons = { success: '✓', error: '!', info: 'i' };
  return icons[variant.value] ?? icons.info;
});
</script>

<template>
  <div
    v-if="toast?.message"
    :class="['toast', `toast-${variant}`]"
    role="status"
    aria-live="polite"
    data-testid="toast-message"
  >
    <div class="toast-content">
      <span class="toast-icon" aria-hidden="true">{{ icon }}</span>
      <p>{{ toast.message }}</p>
    </div>
    <button
      type="button"
      class="button button-secondary button-small"
      aria-label="Dismiss notification"
      data-testid="toast-dismiss-button"
      @click="emit('close')"
    >
      Dismiss
    </button>
  </div>
</template>
