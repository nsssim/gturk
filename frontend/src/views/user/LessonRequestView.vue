<template>
  <div class="container mt-4">
    <h2 class="mb-4">Request Live Lesson</h2>

    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Create New Lesson Request</h5>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="subject" class="form-label">Subject</label>
                <select class="form-select" id="subject" v-model="form.subject" required @change="loadInstructors">
                  <option value="" disabled>Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              <div class="mb-3" v-if="form.subject">
                <label for="instructor" class="form-label">Instructor</label>
                <select class="form-select" id="instructor" v-model="form.instructorId" required @change="updateSelectedInstructor">
                  <option value="" disabled>Select an instructor</option>
                  <option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">
                    {{ instructor.name }} ({{ instructor.subject }})
                  </option>
                </select>
              </div>

              <!-- Selected Time Display -->
              <div class="mb-3" v-if="form.selectedTime">
                <label class="form-label">Selected Time Slot</label>
                <div class="alert alert-info">
                  {{ form.selectedTime }}
                </div>
              </div>
            </form>

            <div v-if="successMessage" class="alert alert-success mt-3">
              {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="alert alert-danger mt-3">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Your Lesson Requests</h5>

            <div v-if="lessonsLoading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>Loading your requests...</p>
            </div>

            <div v-else>
              <div v-if="lessons.length === 0" class="alert alert-info">
                You haven't created any lesson requests yet.
              </div>

              <div v-else class="list-group">
                <div v-for="lesson in lessons" :key="lesson.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ lesson.subject }} - {{ lesson.time }}</h6>
                      <p class="mb-1">Status: <span :class="getStatusBadgeClass(lesson.status)">{{ lesson.status }}</span></p>
                      <p class="mb-1 small">Instructor: {{ getInstructorName(lesson.instructorId) }}</p>
                    </div>
                    <span class="badge" :class="getStatusBadgeClass(lesson.status)">{{ getStatusText(lesson.status) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructor Availability Table with Radio Selection -->
    <div class="row mt-4" v-if="selectedInstructor">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Select Available Time Slot</h5>
            <p class="card-subtitle mb-3 text-muted">
              {{ selectedInstructor.name }} - {{ selectedInstructor.subject }} Specialist
            </p>

            <div class="alert alert-info mb-3">
              <strong>Instructions:</strong> Select an available time slot from the table below. Only available times can be selected.
            </div>

            <div class="table-responsive">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Day</th>
                    <th>Available Time Slots</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(day, index) in daysOfWeek" :key="index">
                    <td>{{ day }}</td>
                    <td>
                      <div v-if="getAvailabilityForDay(day).length > 0" class="d-flex flex-wrap gap-2">
                        <div v-for="(slot, slotIndex) in getAvailabilityForDay(day)" :key="slotIndex" class="form-check">
                          <input class="form-check-input" type="radio" :id="`slot-${index}-${slotIndex}`"
                                 :value="`${day} ${slot}`" v-model="form.selectedTime" required>
                          <label class="form-check-label" :for="`slot-${index}-${slotIndex}`">
                            {{ slot }}
                          </label>
                        </div>
                      </div>
                      <div v-else>
                        <span class="badge bg-secondary">Not available</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Request Lesson Button moved here -->
            <div class="mt-4">
              <button type="button" class="btn btn-primary btn-lg" @click="handleSubmit" :disabled="loading || !form.selectedTime">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ loading ? 'Processing...' : 'Request Lesson' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import matchingService from '../../services/matchingService';

const form = ref({
  subject: '',
  instructorId: '',
  selectedTime: ''
});

const loading = ref(false);
const lessonsLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const lessons = ref([]);
const instructors = ref([]);
const selectedInstructor = ref(null);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

onMounted(async () => {
  await loadLessons();
});

const loadLessons = async () => {
  try {
    lessonsLoading.value = true;
    const data = await matchingService.getUserLessons();
    lessons.value = data;
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load lesson requests';
    console.error('Error loading lessons:', err);
  } finally {
    lessonsLoading.value = false;
  }
};

const loadInstructors = async () => {
  if (!form.value.subject) {
    instructors.value = [];
    selectedInstructor.value = null;
    form.value.selectedTime = '';
    return;
  }

  try {
    console.log(`Loading instructors for subject: ${form.value.subject}`);
    const data = await matchingService.getInstructorsBySubject(form.value.subject);
    console.log('Received instructors:', data);
    instructors.value = data;

    // Auto-select first instructor if available
    if (data.length > 0) {
      form.value.instructorId = data[0].id;
      selectedInstructor.value = data[0];
      form.value.selectedTime = ''; // Reset time selection when instructor changes
    } else {
      selectedInstructor.value = null;
      form.value.selectedTime = '';
      console.log('No instructors found for this subject');
    }
  } catch (err) {
    errorMessage.value = err.message || 'Failed to load instructors';
    console.error('Error loading instructors:', err);
    instructors.value = [];
    selectedInstructor.value = null;
    form.value.selectedTime = '';
  }
};

const updateSelectedInstructor = () => {
  const instructor = instructors.value.find(i => i.id === form.value.instructorId);
  selectedInstructor.value = instructor || null;
  form.value.selectedTime = ''; // Reset time selection when instructor changes
};

const getAvailabilityForDay = (day) => {
  if (!selectedInstructor.value || !selectedInstructor.value.availability) {
    return [];
  }

  const shortDay = day.substring(0, 3);
  return selectedInstructor.value.availability.filter(slot => slot.includes(shortDay));
};

const handleSubmit = async () => {
  if (!form.value.selectedTime) {
    errorMessage.value = 'Please select an available time slot';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = null;
    successMessage.value = null;

    // Extract time from selected time (e.g., "Monday 10-12" -> "Mon 10-12")
    const timeParts = form.value.selectedTime.split(' ');
    const day = timeParts[0].substring(0, 3);
    const timeRange = timeParts[1];
    const formattedTime = `${day} ${timeRange}`;

    const response = await matchingService.createLessonRequest(
      form.value.subject,
      formattedTime,
      form.value.instructorId
    );

    successMessage.value = `Lesson request created! Instructor: ${response.lesson.instructor.name}`;

    // Reset form (keep subject for potential new request)
    form.value.instructorId = '';
    form.value.selectedTime = '';
    selectedInstructor.value = null;

    // Reload lessons
    await loadLessons();

  } catch (err) {
    errorMessage.value = err.message || 'Failed to create lesson request';
    console.error('Error creating lesson request:', err);
  } finally {
    loading.value = false;
  }
};

const getInstructorName = (instructorId) => {
  const instructors = {
    'instructor1': 'Jane Smith',
    'instructor2': 'Bob Johnson',
    'instructor3': 'Alice Chen',
    'instructor4': 'Michael Wilson',
    'instructor5': 'Sarah Johnson',
    'instructor6': 'David Brown'
  };
  return instructors[instructorId] || 'Unknown Instructor';
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
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-select {
  border-radius: 8px;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  padding: 8px 20px;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

.list-group-item {
  margin-bottom: 10px;
  border-radius: 8px;
}

.badge {
  font-size: 0.85em;
}

.table-responsive {
  overflow-x: auto;
}

.table th, .table td {
  vertical-align: middle;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.form-check-input:checked + .form-check-label {
  background-color: #e9f7fe;
  font-weight: 500;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.btn-lg {
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
}
</style>