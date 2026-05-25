<script setup>
import { APP_PATHS } from '../../routes/paths';
</script>

<template>
  <header class="navbar" data-testid="app-navbar">
    <div class="navbar-inner">
      <RouterLink :to="APP_PATHS.employees" class="brand" data-testid="navbar-brand-link">
        Purple Cross
      </RouterLink>
      <nav class="nav-links" aria-label="Main navigation">
        <RouterLink
          :to="APP_PATHS.employees"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
          data-testid="navbar-employees-link"
        >
          Employees
        </RouterLink>
        <RouterLink
          :to="APP_PATHS.createEmployee"
          class="nav-link"
          active-class="active"
          data-testid="navbar-create-employee-link"
        >
          Create Employee
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
