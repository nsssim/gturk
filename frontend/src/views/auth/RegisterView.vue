<template>
  <div class="register-view">
    <div class="logo-container text-center mb-4">
      <img src="/logo.png" alt="EduPlatform Logo" class="app-logo">
    </div>
    <h2 class="text-center mb-4">Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="name" class="form-label">Full Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="form.name"
          required
        >
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="form.email"
          required
        >
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="form.password"
          required
        >
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="form.confirmPassword"
          required
        >
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-else>Register</span>
      </button>
    </form>
    <div class="mt-3 text-center">
      <p>Already have an account? <router-link to="/auth/login">Login</router-link></p>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref(null);

const handleRegister = async () => {
  try {
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match';
      return;
    }

    loading.value = true;
    error.value = null;
    await authStore.register(form.value);
    await router.push({ name: 'Login' });
  } catch (err) {
    error.value = err.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-view {
  max-width: 400px;
  margin: 0 auto;
}

.logo-container {
  margin-bottom: 2rem;
}

.app-logo {
  height: 60px;
  width: auto;
  transition: transform 0.2s ease;
}

.app-logo:hover {
  transform: scale(1.05);
}
</style>