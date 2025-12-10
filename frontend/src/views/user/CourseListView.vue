<template>
  <div class="container mt-4">
    <h2 class="mb-4">Available Courses</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading courses...</p>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="row">
        <div v-for="course in courses" :key="course.id" class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text">{{ course.description }}</p>
              <p class="card-text"><strong>Price:</strong> ${{ course.price.toFixed(2) }}</p>
              <p class="card-text"><small class="text-muted">Instructor: {{ getInstructorName(course.instructor) }}</small></p>
            </div>
            <div class="card-footer">
              <button
                @click="selectCourse(course)"
                class="btn btn-primary"
                :disabled="isCoursePurchased(course.id)"
              >
                {{ isCoursePurchased(course.id) ? 'Already Purchased' : 'Purchase Course' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="paymentModalLabel">Purchase Course: {{ selectedCourse?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handlePurchase">
              <div class="mb-3">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input type="text" class="form-control" id="cardNumber" v-model="cardDetails.cardNumber" placeholder="4242 4242 4242 4242" required>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="expiry" class="form-label">Expiry Date</label>
                  <input type="text" class="form-control" id="expiry" v-model="cardDetails.expiry" placeholder="MM/YY" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="cvv" class="form-label">CVV</label>
                  <input type="text" class="form-control" id="cvv" v-model="cardDetails.cvv" placeholder="123" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="cardName" class="form-label">Card Holder Name</label>
                <input type="text" class="form-control" id="cardName" v-model="cardDetails.cardName" placeholder="John Doe" required>
              </div>

              <div class="alert alert-info">
                <strong>Amount:</strong> ${{ selectedCourse?.price?.toFixed(2) }}
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="paymentLoading">
                  <span v-if="paymentLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {{ paymentLoading ? 'Processing...' : 'Complete Purchase' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import paymentService from '../../services/paymentService';
import { Modal } from 'bootstrap';

let paymentModal = null;

const authStore = useAuthStore();
const router = useRouter();

const courses = ref([]);
const purchasedCourses = ref([]);
const loading = ref(false);
const error = ref(null);
const paymentLoading = ref(false);
const paymentError = ref(null);
const paymentSuccess = ref(null);

const selectedCourse = ref(null);
const cardDetails = ref({
  cardNumber: '4242424242424242',
  expiry: '12/25',
  cvv: '123',
  cardName: 'Test User'
});

onMounted(async () => {
  await loadCourses();
  await loadPurchasedCourses();
});

const loadCourses = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await paymentService.getAllCourses();
    courses.value = data;
  } catch (err) {
    error.value = err.message || 'Failed to load courses';
    console.error('Error loading courses:', err);
  } finally {
    loading.value = false;
  }
};

const loadPurchasedCourses = async () => {
  try {
    const data = await paymentService.getPurchasedCourses();
    purchasedCourses.value = data.map(course => course.id);
  } catch (err) {
    if (err.message.includes('Course not found') || err.message.includes('User not found')) {
      // User has no purchased courses or is not authenticated
      purchasedCourses.value = [];
    } else {
      console.error('Error loading purchased courses:', err);
    }
  }
};

const getInstructorName = (instructorId) => {
  // In a real app, this would fetch from a users/instructors API
  const instructors = {
    'instructor1': 'Jane Smith',
    'instructor2': 'Bob Johnson'
  };
  return instructors[instructorId] || 'Unknown Instructor';
};

const isCoursePurchased = (courseId) => {
  return purchasedCourses.value.includes(courseId);
};

const selectCourse = (course) => {
  selectedCourse.value = course;
  if (!paymentModal) {
    const modalElement = document.getElementById('paymentModal');
    paymentModal = new Modal(modalElement);
  }
  paymentModal.show();
};

const handlePurchase = async () => {
  try {
    paymentLoading.value = true;
    paymentError.value = null;
    paymentSuccess.value = null;

    const response = await paymentService.purchaseCourse(selectedCourse.value.id, cardDetails.value);

    // Update purchased courses list
    purchasedCourses.value.push(selectedCourse.value.id);

    paymentSuccess.value = `Course purchased successfully! Transaction ID: ${response.payment.transactionId}`;

    // Close modal after 2 seconds
    setTimeout(() => {
      paymentModal.hide();
      // Reset form
      cardDetails.value = {
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardName: ''
      };
      selectedCourse.value = null;
    }, 2000);

  } catch (err) {
    paymentError.value = err.message || 'Payment failed';
    console.error('Payment error:', err);
  } finally {
    paymentLoading.value = false;
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.modal-content {
  border-radius: 10px;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}
</style>