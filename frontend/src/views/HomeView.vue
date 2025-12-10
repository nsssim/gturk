<template>
  <div class="home-view">
    <div class="logo-container">
      <img src="/logo.png"
           alt="Educational Platform Logo"
           class="platform-logo">
    </div>
    <h1>{{ $t('welcomeTo') }} {{ $t('educationalPlatform') }}</h1>
    <p>{{ $t('yourGatewayTo') }} {{ $t('learning') }} {{ $t('and') }} {{ $t('teaching') }}</p>
    <div class="action-buttons">
      <router-link to="/auth/login" class="btn btn-primary">{{ $t('login') }}</router-link>
      <router-link to="/auth/register" class="btn btn-secondary">{{ $t('register') }}</router-link>
    </div>
  </div>
</template>

<script setup>
// Home view component
</script>

<style scoped>
.home-view {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.logo-container {
  margin-bottom: 1.5rem;
}

.platform-logo {
  max-width: 200px;
  height: auto;
}

.action-buttons {
  margin-top: 2rem;
}

.action-buttons .btn {
  margin: 0 0.5rem;
}
</style>