<template>
  <div class="container mt-4">
    <h2 class="mb-4">My Purchased Courses</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading your courses...</p>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="purchasedCourses.length === 0" class="alert alert-info">
        You haven't purchased any courses yet. <router-link to="/user/courses">Browse available courses</router-link>
      </div>

      <div v-else class="row">
        <div v-for="course in purchasedCourses" :key="course.id" class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text">{{ course.description }}</p>
              <p class="card-text"><strong>Price:</strong> ${{ course.price.toFixed(2) }}</p>
              <p class="card-text"><small class="text-muted">Instructor: {{ getInstructorName(course.instructor) }}</small></p>
              <div class="badge bg-success">Purchased</div>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-primary me-2">View Course</button>
              <button class="btn btn-outline-secondary">Leave Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import paymentService from '../../services/paymentService';

const purchasedCourses = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  await loadPurchasedCourses();
});

const loadPurchasedCourses = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await paymentService.getPurchasedCourses();
    purchasedCourses.value = data;
  } catch (err) {
    if (err.message.includes('Course not found') || err.message.includes('User not found')) {
      // User has no purchased courses - this is not really an error
      purchasedCourses.value = [];
    } else {
      error.value = err.message || 'Failed to load purchased courses';
      console.error('Error loading purchased courses:', err);
    }
  } finally {
    loading.value = false;
  }
};

const getInstructorName = (instructorId) => {
  const instructors = {
    'instructor1': 'Jane Smith',
    'instructor2': 'Bob Johnson'
  };
  return instructors[instructorId] || 'Unknown Instructor';
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>