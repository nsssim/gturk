<template>
  <div class="dashboard-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">{{ $t('educationalPlatform') }}</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="dashboardNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/user/dashboard" class="nav-link">{{ $t('dashboard') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/user/profile" class="nav-link">{{ $t('profile') }}</router-link>
            </li>
            <li class="nav-item">
              <LanguageSwitcher />
            </li>
            <li class="nav-item">
              <button class="btn btn-link nav-link" @click="logout">{{ $t('logout') }}</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import LanguageSwitcher from '../../components/LanguageSwitcher.vue';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>