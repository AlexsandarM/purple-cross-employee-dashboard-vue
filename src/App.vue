<script setup>
import { provideEmployees } from './composables/useEmployees';
provideEmployees();
</script>
<template>
  <RouterView />
</template>
