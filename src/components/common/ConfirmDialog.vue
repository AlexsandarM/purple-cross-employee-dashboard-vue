<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div
    v-if="open"
    class="modal-backdrop"
    role="presentation"
    data-testid="confirm-dialog-backdrop"
  >
    <div
      class="modal-card"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      data-testid="confirm-dialog"
    >
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="row-actions">
        <button
          type="button"
          class="button button-secondary"
          data-testid="confirm-dialog-cancel-button"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="button button-danger"
          data-testid="confirm-dialog-confirm-button"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
