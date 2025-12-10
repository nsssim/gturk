<template>
  <div class="container mt-4">
    <h2 class="mb-4">Course Management</h2>

    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">All Courses</h5>
          <button class="btn btn-primary" @click="openCreateModal">
            <i class="bi bi-plus"></i> Create New Course
          </button>
        </div>

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

          <div v-if="courses.length === 0" class="alert alert-info">
            No courses found. Create your first course!
          </div>

          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in courses" :key="course.id">
                  <td>{{ course.id }}</td>
                  <td>{{ course.title }}</td>
                  <td>{{ getInstructorName(course.instructor) }}</td>
                  <td>${{ course.price.toFixed(2) }}</td>
                  <td>{{ course.students.length }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-warning" @click="openEditModal(course)">
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteCourse(course.id)">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Modal -->
    <div class="modal fade" id="courseModal" tabindex="-1" aria-labelledby="courseModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="courseModalLabel">
              {{ editingCourse ? 'Edit Course' : 'Create New Course' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" v-model="form.title" required>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" v-model="form.description" rows="3" required></textarea>
              </div>

              <div class="mb-3">
                <label for="instructor" class="form-label">Instructor</label>
                <select class="form-select" id="instructor" v-model="form.instructor" required>
                  <option value="" disabled>Select an instructor</option>
                  <option value="instructor1">Jane Smith (Mathematics)</option>
                  <option value="instructor2">Bob Johnson (Physics)</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="price" class="form-label">Price ($)</label>
                <input type="number" class="form-control" id="price" v-model="form.price" step="0.01" min="0" required>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="formLoading">
                  <span v-if="formLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {{ formLoading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course' }}
                </button>
              </div>
            </form>

            <div v-if="formError" class="alert alert-danger mt-3">
              {{ formError }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import adminService from '../../services/adminService';

let courseModal = null;

const courses = ref([]);
const loading = ref(false);
const error = ref(null);
const formLoading = ref(false);
const formError = ref(null);

const editingCourse = ref(null);
const form = ref({
  title: '',
  description: '',
  instructor: '',
  price: 0
});

onMounted(async () => {
  await loadCourses();
});

const loadCourses = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await adminService.getAllCourses();
    courses.value = data;
  } catch (err) {
    error.value = err.message || 'Failed to load courses';
    console.error('Error loading courses:', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingCourse.value = null;
  form.value = {
    title: '',
    description: '',
    instructor: '',
    price: 0
  };
  formError.value = null;

  if (!courseModal) {
    const modalElement = document.getElementById('courseModal');
    courseModal = new Modal(modalElement);
  }
  courseModal.show();
};

const openEditModal = (course) => {
  editingCourse.value = course.id;
  form.value = {
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    price: course.price
  };
  formError.value = null;

  if (!courseModal) {
    const modalElement = document.getElementById('courseModal');
    courseModal = new Modal(modalElement);
  }
  courseModal.show();
};

const handleSubmit = async () => {
  try {
    formLoading.value = true;
    formError.value = null;

    if (editingCourse.value) {
      // Update existing course
      await adminService.updateCourse(editingCourse.value, form.value);
    } else {
      // Create new course
      await adminService.createCourse(form.value);
    }

    // Reload courses
    await loadCourses();

    // Close modal
    courseModal.hide();

  } catch (err) {
    formError.value = err.message || 'Failed to save course';
    console.error('Error saving course:', err);
  } finally {
    formLoading.value = false;
  }
};

const deleteCourse = async (courseId) => {
  if (!confirm('Are you sure you want to delete this course?')) {
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    await adminService.deleteCourse(courseId);

    // Reload courses
    await loadCourses();

  } catch (err) {
    error.value = err.message || 'Failed to delete course';
    console.error('Error deleting course:', err);
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table th {
  background-color: #f8f9fa;
}

.btn-sm {
  margin-right: 5px;
}

.modal-content {
  border-radius: 10px;
}

.bi {
  margin-right: 5px;
}
</style>