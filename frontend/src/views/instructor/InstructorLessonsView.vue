<template>
  <div class="container mt-4">
    <h2 class="mb-4">Lesson Requests</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading lesson requests...</p>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="lessons.length === 0" class="alert alert-info">
        You don't have any lesson requests yet.
      </div>

      <div v-else class="row">
        <div v-for="lesson in lessons" :key="lesson.id" class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ lesson.subject }} Lesson</h5>
              <p class="card-text"><strong>Time:</strong> {{ lesson.time }}</p>
              <p class="card-text"><strong>Student:</strong> User {{ lesson.userId }}</p>
              <p class="card-text">
                <strong>Status:</strong>
                <span class="badge" :class="getStatusBadgeClass(lesson.status)">
                  {{ getStatusText(lesson.status) }}
                </span>
              </p>

              <div v-if="lesson.status === 'pending'" class="mt-3">
                <div class="d-flex gap-2">
                  <button
                    @click="updateLessonStatus(lesson.id, 'confirmed')"
                    class="btn btn-success btn-sm"
                    :disabled="updatingLessonId === lesson.id"
                  >
                    <span v-if="updatingLessonId === lesson.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Accept
                  </button>
                  <button
                    @click="updateLessonStatus(lesson.id, 'cancelled')"
                    class="btn btn-danger btn-sm"
                    :disabled="updatingLessonId === lesson.id"
                  >
                    <span v-if="updatingLessonId === lesson.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Decline
                  </button>
                </div>
              </div>

              <div v-else-if="lesson.status === 'cancelled'" class="mt-3">
                <div class="d-flex gap-2">
                  <button
                    @click="updateLessonStatus(lesson.id, 'confirmed')"
                    class="btn btn-success btn-sm"
                    :disabled="updatingLessonId === lesson.id"
                  >
                    <span v-if="updatingLessonId === lesson.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Confirm
                  </button>
                  <button
                    @click="updateLessonStatus(lesson.id, 'pending')"
                    class="btn btn-warning btn-sm"
                    :disabled="updatingLessonId === lesson.id"
                  >
                    <span v-if="updatingLessonId === lesson.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Reopen
                  </button>
                </div>
              </div>

              <div v-else class="mt-3">
                <p class="text-muted small">
                  Lesson confirmed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import matchingService from '../../services/matchingService';

const lessons = ref([]);
const loading = ref(false);
const error = ref(null);
const updatingLessonId = ref(null);

onMounted(async () => {
  await loadLessons();
});

const loadLessons = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await matchingService.getInstructorLessons();
    lessons.value = data;
  } catch (err) {
    if (err.message.includes('Authentication required')) {
      error.value = 'Please log in to view your lesson requests.';
    } else {
      error.value = err.message || 'Failed to load lesson requests';
    }
    console.error('Error loading lessons:', err);
  } finally {
    loading.value = false;
  }
};

const updateLessonStatus = async (lessonId, status) => {
  try {
    updatingLessonId.value = lessonId;
    error.value = null;

    await matchingService.updateLessonStatus(lessonId, status);

    // Update local state
    const lessonIndex = lessons.value.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex !== -1) {
      lessons.value[lessonIndex].status = status;
    }

  } catch (err) {
    error.value = err.message || 'Failed to update lesson status';
    console.error('Error updating lesson status:', err);
  } finally {
    updatingLessonId.value = null;
  }
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-warning text-dark',
    confirmed: 'bg-success',
    cancelled: 'bg-danger'
  };
  return classes[status] || 'bg-secondary';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled'
  };
  return texts[status] || status;
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

.badge {
  font-size: 0.9em;
}

.btn-sm {
  padding: 5px 15px;
  font-size: 0.85em;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}
</style>