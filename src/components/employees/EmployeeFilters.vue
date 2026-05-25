<script setup>
defineProps({
  searchTerm: { type: String, required: true },
  departmentFilter: { type: String, required: true },
  occupationFilter: { type: String, required: true },
  departmentOptions: { type: Array, required: true },
  occupationOptions: { type: Array, required: true },
});

const emit = defineEmits([
  'update:searchTerm',
  'update:departmentFilter',
  'update:occupationFilter',
  'clearFilters',
]);
</script>

<template>
  <div class="card" data-testid="employee-filters-card">
    <div class="employee-filters-grid">
      <label class="field" for="employee-search-input">
        <span>Search</span>
        <input
          id="employee-search-input"
          class="input"
          type="text"
          :value="searchTerm"
          placeholder="Search by name, code, department, occupation"
          data-testid="employee-search-input"
          @input="emit('update:searchTerm', $event.target.value)"
        />
      </label>

      <label class="field" for="employee-department-filter">
        <span>Department</span>
        <select
          id="employee-department-filter"
          class="input"
          :value="departmentFilter"
          data-testid="employee-department-filter"
          @change="emit('update:departmentFilter', $event.target.value)"
        >
          <option value="">All departments</option>
          <option v-for="option in departmentOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>

      <label class="field" for="employee-occupation-filter">
        <span>Occupation</span>
        <select
          id="employee-occupation-filter"
          class="input"
          :value="occupationFilter"
          data-testid="employee-occupation-filter"
          @change="emit('update:occupationFilter', $event.target.value)"
        >
          <option value="">All occupations</option>
          <option v-for="option in occupationOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <div class="employee-filters-footer">
      <button
        type="button"
        class="button button-secondary button-small"
        data-testid="employee-clear-filters-button"
        @click="emit('clearFilters')"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>
