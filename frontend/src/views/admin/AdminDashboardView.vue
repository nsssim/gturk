<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Dashboard</h2>
    <p class="welcome-message">Welcome, {{ authStore.user?.name || 'Admin' }}!</p>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading dashboard data...</p>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h5 class="card-title">Total Users</h5>
              <p class="card-text display-4">{{ stats.userCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-success mb-3">
            <div class="card-body">
              <h5 class="card-title">Instructors</h5>
              <p class="card-text display-4">{{ stats.instructorCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-warning mb-3">
            <div class="card-body">
              <h5 class="card-title">Courses</h5>
              <p class="card-text display-4">{{ stats.courseCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-info mb-3">
            <div class="card-body">
              <h5 class="card-title">Lessons</h5>
              <p class="card-text display-4">{{ stats.lessonCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Quick Actions</h5>
              <div class="d-grid gap-2">
                <router-link to="/admin/users" class="btn btn-outline-primary">Manage Users</router-link>
                <router-link to="/admin/instructors" class="btn btn-outline-success">Manage Instructors</router-link>
                <router-link to="/admin/courses" class="btn btn-outline-warning">Manage Courses</router-link>
                <router-link to="/admin/lessons" class="btn btn-outline-info">View Lessons</router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">System Revenue</h5>
              <p class="card-text display-4">${{ stats.totalRevenue?.toFixed(2) || '0.00' }}</p>
              <p class="text-muted">Total revenue from course sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import adminService from '../../services/adminService';

const authStore = useAuthStore();

const stats = ref({
  userCount: 0,
  instructorCount: 0,
  adminCount: 0,
  courseCount: 0,
  lessonCount: 0,
  totalRevenue: 0
});

const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  await loadStats();
});

const loadStats = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await adminService.getSystemStats();
    stats.value = data;
  } catch (err) {
    error.value = err.message || 'Failed to load system statistics';
    console.error('Error loading stats:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-outline-primary, .btn-outline-success, .btn-outline-warning, .btn-outline-info {
  margin-bottom: 8px;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 300;
}
</style>