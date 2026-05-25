<script setup>
import { reactive, ref, watch } from 'vue';

const EMPTY_VALUES = {
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
};

const props = defineProps({
  initialValues: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: 'Save' },
  formError: { type: String, default: '' },
  submitTestId: { type: String, default: 'employee-form-submit-button' },
  disableCodeField: { type: Boolean, default: false },
  codeReadOnlyMessage: { type: String, default: '' },
  onSubmit: { type: Function, required: true },
});

const emit = defineEmits(['cancel']);

const values = reactive({ ...EMPTY_VALUES, ...props.initialValues });
const errors = ref({});

watch(
  () => props.initialValues,
  (next) => {
    Object.assign(values, EMPTY_VALUES, next, {
      terminationDate: next?.terminationDate ?? '',
    });
    errors.value = {};
  },
  { deep: true }
);

function handleChange(field, event) {
  values[field] = event.target.value;
  if (errors.value[field]) {
    const copy = { ...errors.value };
    delete copy[field];
    errors.value = copy;
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const result = props.onSubmit({ ...values });
  if (result?.errors) {
    errors.value = result.errors;
  } else {
    errors.value = {};
  }
}
</script>

<template>
  <form class="card employee-form" data-testid="employee-form" @submit="handleSubmit">
    <div class="employee-form-grid">
      <label class="field" for="employee-code-input">
        <span>Code *</span>
        <input
          id="employee-code-input"
          class="input"
          type="text"
          :value="values.code"
          :disabled="disableCodeField"
          data-testid="employee-code-input"
          @input="handleChange('code', $event)"
        />
        <small v-if="errors.code" class="field-error" data-testid="employee-code-error">
          {{ errors.code }}
        </small>
      </label>

      <label class="field" for="employee-full-name-input">
        <span>Full Name *</span>
        <input
          id="employee-full-name-input"
          class="input"
          type="text"
          :value="values.fullName"
          data-testid="employee-full-name-input"
          @input="handleChange('fullName', $event)"
        />
        <small
          v-if="errors.fullName"
          class="field-error"
          data-testid="employee-full-name-error"
        >
          {{ errors.fullName }}
        </small>
      </label>

      <label class="field" for="employee-occupation-input">
        <span>Occupation *</span>
        <input
          id="employee-occupation-input"
          class="input"
          type="text"
          :value="values.occupation"
          data-testid="employee-occupation-input"
          @input="handleChange('occupation', $event)"
        />
        <small
          v-if="errors.occupation"
          class="field-error"
          data-testid="employee-occupation-error"
        >
          {{ errors.occupation }}
        </small>
      </label>

      <label class="field" for="employee-department-input">
        <span>Department *</span>
        <input
          id="employee-department-input"
          class="input"
          type="text"
          :value="values.department"
          data-testid="employee-department-input"
          @input="handleChange('department', $event)"
        />
        <small
          v-if="errors.department"
          class="field-error"
          data-testid="employee-department-error"
        >
          {{ errors.department }}
        </small>
      </label>

      <label class="field" for="employee-employment-date-input">
        <span>Date of Employment</span>
        <input
          id="employee-employment-date-input"
          class="input"
          type="date"
          :value="values.dateOfEmployment"
          data-testid="employee-date-of-employment-input"
          @input="handleChange('dateOfEmployment', $event)"
        />
        <small
          v-if="errors.dateOfEmployment"
          class="field-error"
          data-testid="employee-date-of-employment-error"
        >
          {{ errors.dateOfEmployment }}
        </small>
      </label>

      <label class="field" for="employee-termination-date-input">
        <span>Termination Date</span>
        <input
          id="employee-termination-date-input"
          class="input"
          type="date"
          :value="values.terminationDate"
          data-testid="employee-termination-date-input"
          @input="handleChange('terminationDate', $event)"
        />
        <small
          v-if="errors.terminationDate"
          class="field-error"
          data-testid="employee-termination-date-error"
        >
          {{ errors.terminationDate }}
        </small>
      </label>
    </div>

    <p
      v-if="disableCodeField && codeReadOnlyMessage"
      class="field-help employee-form-note"
      data-testid="employee-code-help"
    >
      {{ codeReadOnlyMessage }}
    </p>

    <p v-if="formError" class="form-error-banner" data-testid="employee-form-error-banner">
      {{ formError }}
    </p>

    <div class="row-actions">
      <button
        type="button"
        class="button button-secondary"
        data-testid="employee-form-cancel-button"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button type="submit" class="button button-primary" :data-testid="submitTestId">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>
