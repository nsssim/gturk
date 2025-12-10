<template>
  <div class="admin-layout">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link to="/admin" class="navbar-brand">{{ $t('admin') }} {{ $t('dashboard') }}</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/admin/dashboard" class="nav-link">{{ $t('dashboard') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/users" class="nav-link">{{ $t('userManagement') }}</router-link>
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

    <main class="container-fluid mt-4">
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
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>