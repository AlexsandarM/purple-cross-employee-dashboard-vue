<script setup>
import Navbar from './Navbar.vue';
</script>

<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link" data-testid="skip-to-content-link">
      Skip to main content
    </a>
    <Navbar />
    <main id="main-content" class="app-content" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
