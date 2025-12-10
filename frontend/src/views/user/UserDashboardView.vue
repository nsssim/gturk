<template>
  <div class="user-dashboard">
    <h1>{{ $t('userDashboard') }}</h1>
    <p>{{ $t('welcome') }}, {{ authStore.user?.name || $t('user') }}!</p>

    <div class="row mt-4">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">📚 {{ $t('availableCourses') }}</h5>
            <p class="card-text">{{ $t('browseAndPurchaseCourses') }}</p>
            <router-link to="/user/courses" class="btn btn-primary">{{ $t('browseCourses') }}</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">🎓 {{ $t('myCourses') }}</h5>
            <p class="card-text">{{ $t('viewAndManageCourses') }}</p>
            <router-link to="/user/purchased" class="btn btn-success">{{ $t('myPurchasedCourses') }}</router-link>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">👨‍🏫 {{ $t('liveLessons') }}</h5>
            <p class="card-text">{{ $t('requestLiveLessons') }}</p>
            <router-link to="/user/lessons" class="btn btn-info">{{ $t('requestLesson') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
</script>

<style scoped>
.user-dashboard {
  padding: 2rem;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
}
</style>