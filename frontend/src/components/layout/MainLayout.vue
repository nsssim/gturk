<template>
  <div class="main-layout">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/" class="navbar-brand">{{ $t('educationalPlatform') }}</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">{{ $t('home') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/auth/login" class="nav-link">{{ $t('login') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/auth/register" class="nav-link">{{ $t('register') }}</router-link>
            </li>
            <li class="nav-item">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>

    <footer class="mt-5 py-4 bg-light">
      <div class="container text-center">
        <p>&copy; 2025 {{ $t('educationalPlatform') }}. {{ $t('allRightsReserved') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import LanguageSwitcher from '../../components/LanguageSwitcher.vue';

// Main layout component
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>