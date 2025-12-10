<template>
  <div class="auth-layout">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="auth-card">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Auth layout component
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  width: 100%;
}
</style>