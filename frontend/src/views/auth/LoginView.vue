<template>
  <div class="login-view">
    <div class="logo-container text-center mb-4">
      <img src="/logo.png" alt="EduPlatform Logo" class="app-logo">
    </div>
    <h2 class="text-center mb-4">{{ $t('login') }}</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">{{ $t('emailAddress') }}</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="form.email"
          required
        >
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">{{ $t('password') }}</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="form.password"
          required
        >
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="remember">
        <label class="form-check-label" for="remember">{{ $t('rememberMe') }}</label>
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-else>{{ $t('login') }}</span>
      </button>
    </form>
    <div class="mt-3 text-center">
      <p>{{ $t('dontHaveAccount') }} <router-link to="/auth/register">{{ $t('register') }}</router-link></p>
    </div>
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = null;
    await authStore.login(form.value);

    // Redirect based on user role after successful login
    if (authStore.userRole === 'admin') {
      router.push({ name: 'AdminDashboard' });
    } else if (authStore.userRole === 'instructor') {
      router.push({ name: 'InstructorDashboard' });
    } else {
      // Default redirect for students/users
      router.push({ name: 'UserDashboard' });
    }
  } catch (err) {
    error.value = err.message || $t('loginFailed');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 0 auto;
}

.logo-container {
  margin-bottom: 2.5rem;
}

.app-logo {
  height: 100px;
  width: auto;
  transition: transform 0.2s ease;
}

.app-logo:hover {
  transform: scale(1.05);
}
</style>