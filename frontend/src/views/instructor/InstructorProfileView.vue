<template>
  <div class="container mt-4">
    <h2 class="mb-4">Your Profile</h2>

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Profile Information</h5>

            <form @submit.prevent="handleSubmit">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="name" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="name" v-model="form.name" required>
                </div>
                <div class="col-md-6">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" v-model="form.email" required>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="subject" class="form-label">Subject</label>
                  <select class="form-select" id="subject" v-model="form.subject" required>
                    <option value="" disabled>Select your subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="History">History</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="experience" class="form-label">Years of Experience</label>
                  <input type="number" class="form-control" id="experience" v-model="form.experience" min="0">
                </div>
              </div>

              <div class="mb-3">
                <label for="bio" class="form-label">Bio</label>
                <textarea class="form-control" id="bio" v-model="form.bio" rows="3"></textarea>
                <div class="form-text">Tell students about your teaching experience and approach</div>
              </div>

              <div class="mb-3">
                <label for="availability" class="form-label">Availability</label>
                <textarea class="form-control" id="availability" v-model="form.availability" rows="2"></textarea>
                <div class="form-text">e.g., Mon-Fri 9:00-17:00, Weekends by appointment</div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="resetForm">Reset</button>
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

      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Account Actions</h5>
            <div class="d-grid gap-2">
              <button class="btn btn-outline-danger" @click="handleLogout">
                Logout
              </button>
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
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  subject: '',
  experience: 0,
  bio: '',
  availability: ''
});

const loading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

onMounted(() => {
  // Load current user data
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      subject: authStore.user.subject || '',
      experience: authStore.user.experience || 0,
      bio: authStore.user.bio || '',
      availability: authStore.user.availability || ''
    };
  }
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    errorMessage.value = null;
    successMessage.value = null;

    // Simulate API call to update profile
    // In a real implementation, this would call a backend API
    console.log('Updating profile:', form.value);

    // Update auth store with new data
    const updatedUser = {
      ...authStore.user,
      ...form.value
    };

    // Update localStorage
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    authData.user = updatedUser;
    localStorage.setItem('auth', JSON.stringify(authData));

    // Update auth store
    authStore.user = updatedUser;

    successMessage.value = 'Profile updated successfully!';
    setTimeout(() => successMessage.value = null, 3000);

  } catch (err) {
    errorMessage.value = err.message || 'Failed to update profile';
    console.error('Error updating profile:', err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      subject: authStore.user.subject || '',
      experience: authStore.user.experience || 0,
      bio: authStore.user.bio || '',
      availability: authStore.user.availability || ''
    };
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (err) {
    errorMessage.value = 'Failed to logout';
    console.error('Logout error:', err);
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-control, .form-select {
  border-radius: 8px;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
</style>