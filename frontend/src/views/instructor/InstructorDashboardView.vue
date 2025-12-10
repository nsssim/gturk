<template>
  <div class="instructor-dashboard">
    <h1>{{ $t('instructorDashboard') }}</h1>
    <p>{{ $t('welcome') }}, {{ authStore.user?.name || $t('instructor') }}!</p>
    <div class="dashboard-content">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ $t('myLessons') }}</h5>
              <p class="card-text">{{ $t('viewAndManageYourLessons') }}</p>
              <router-link to="/instructor/lessons" class="btn btn-primary">{{ $t('myLessons') }}</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ $t('myProfile') }}</h5>
              <p class="card-text">{{ $t('viewAndEditYourProfile') }}</p>
              <router-link to="/instructor/profile" class="btn btn-primary">{{ $t('myProfile') }}</router-link>
            </div>
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
.instructor-dashboard {
  padding: 2rem;
}

.dashboard-content {
  margin-top: 2rem;
}
</style>