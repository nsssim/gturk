<template>
  <div class="forbidden">
    <h1>403 - Forbidden</h1>
    <p>You don't have permission to access this page.</p>
    <router-link to="/" class="btn btn-primary">Go Home</router-link>
  </div>
</template>

<script setup>
// Forbidden view
</script>

<style scoped>
.forbidden {
  text-align: center;
  padding: 2rem;
  margin-top: 5rem;
}
</style>