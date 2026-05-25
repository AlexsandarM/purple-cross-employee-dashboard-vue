<script setup>
import { APP_PATHS } from '../routes/paths';
</script>

<template>
  <section class="page" data-testid="not-found-page">
    <h1>Page not found</h1>
    <p>The route you requested does not exist.</p>
    <RouterLink
      :to="APP_PATHS.employees"
      class="button button-primary"
      data-testid="not-found-back-to-employees"
    >
      Go to Employees
    </RouterLink>
  </section>
</template>
