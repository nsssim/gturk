<template>
  <div class="container mt-4">
    <h2 class="mb-4">User Management</h2>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">System Statistics</h5>
        <div class="row">
          <div class="col-md-4">
            <div class="stat-card">
              <h6>Total Users</h6>
              <p class="stat-value">{{ stats.userCount }}</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card">
              <h6>Instructors</h6>
              <p class="stat-value">{{ stats.instructorCount }}</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card">
              <h6>Admins</h6>
              <p class="stat-value">{{ stats.adminCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">All Users</h5>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-primary" @click="currentTab = 'users'">Users</button>
            <button class="btn btn-sm btn-outline-success" @click="currentTab = 'instructors'">Instructors</button>
            <button class="btn btn-sm btn-outline-danger" @click="currentTab = 'admins'">Admins</button>
          </div>
        </div>

        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading users...</p>
        </div>

        <div v-else>
          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div v-if="filteredUsers.length === 0" class="alert alert-info">
            No users found in this category.
          </div>

          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" :class="getRoleBadgeClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary">View</button>
                    <button class="btn btn-sm btn-outline-warning">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import adminService from '../../services/adminService';

const users = ref([]);
const instructors = ref([]);
const admins = ref([]);
const stats = ref({
  userCount: 0,
  instructorCount: 0,
  adminCount: 0
});

const loading = ref(false);
const error = ref(null);
const currentTab = ref('users');

onMounted(async () => {
  await loadAllUsers();
});

const loadAllUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Load all user types
    const [usersData, instructorsData, adminsData, statsData] = await Promise.all([
      adminService.getAllUsers(),
      adminService.getAllInstructors(),
      adminService.getAllAdmins(),
      adminService.getSystemStats()
    ]);

    users.value = usersData;
    instructors.value = instructorsData;
    admins.value = adminsData;
    stats.value = statsData;

  } catch (err) {
    error.value = err.message || 'Failed to load users';
    console.error('Error loading users:', err);
  } finally {
    loading.value = false;
  }
};

const filteredUsers = computed(() => {
  switch (currentTab.value) {
    case 'users': return users.value;
    case 'instructors': return instructors.value;
    case 'admins': return admins.value;
    default: return users.value;
  }
});

const getRoleBadgeClass = (role) => {
  const classes = {
    user: 'bg-primary',
    instructor: 'bg-success',
    admin: 'bg-danger'
  };
  return classes[role] || 'bg-secondary';
};
</script>

<style scoped>
.stat-card {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.btn-sm {
  margin-right: 5px;
}

.table th {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.9em;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>