<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/" class="btn btn-primary">Go Home</router-link>
  </div>
</template>

<script setup>
// 404 Not Found view
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
  margin-top: 5rem;
}
</style>