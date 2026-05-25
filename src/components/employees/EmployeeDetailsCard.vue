<script setup>
import { computed } from 'vue';
import StatusBadge from '../common/StatusBadge.vue';
import { formatDate } from '../../utils/dateUtils';
import {
  getEmploymentStatus,
  getTerminationStatus,
} from '../../utils/employeeStatus';

const props = defineProps({
  employee: { type: Object, required: true },
});

const employmentStatus = computed(() =>
  getEmploymentStatus(props.employee.dateOfEmployment)
);
const terminationStatus = computed(() =>
  getTerminationStatus(props.employee.terminationDate)
);
</script>

<template>
  <article class="card employee-details-card" data-testid="employee-details-card">
    <div class="employee-details-grid">
      <div class="employee-details-item">
        <p class="employee-details-label">Code</p>
        <p data-testid="employee-details-code">{{ employee.code }}</p>
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Full Name</p>
        <p data-testid="employee-details-full-name">{{ employee.fullName }}</p>
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Occupation</p>
        <p data-testid="employee-details-occupation">{{ employee.occupation }}</p>
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Department</p>
        <p data-testid="employee-details-department">{{ employee.department }}</p>
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Date of Employment</p>
        <p data-testid="employee-details-date-of-employment">
          {{ formatDate(employee.dateOfEmployment) }}
        </p>
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Employment Status</p>
        <StatusBadge
          :status="employmentStatus"
          test-id="employee-details-employment-status"
        />
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Termination Date</p>
        <p data-testid="employee-details-termination-date">
          {{ formatDate(employee.terminationDate) }}
        </p>
      </div>
      <div class="employee-details-item">
        <p class="employee-details-label">Termination Status</p>
        <StatusBadge
          :status="terminationStatus"
          test-id="employee-details-termination-status"
        />
      </div>
    </div>
  </article>
</template>
