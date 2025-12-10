import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Import layout components
import MainLayout from '../components/layout/MainLayout.vue';
import AuthLayout from '../components/layout/AuthLayout.vue';
import DashboardLayout from '../components/layout/DashboardLayout.vue';
import AdminLayout from '../components/layout/AdminLayout.vue';
import InstructorLayout from '../components/layout/InstructorLayout.vue';

// Import views
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import UserDashboardView from '../views/user/UserDashboardView.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import InstructorDashboardView from '../views/instructor/InstructorDashboardView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import ForbiddenView from '../views/ForbiddenView.vue';

const routes = [
  // Public routes
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: HomeView }
    ]
  },

  // Authentication routes
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: 'register', name: 'Register', component: RegisterView }
    ]
  },

  // User routes (protected)
  {
    path: '/user',
    component: DashboardLayout,
    meta: { requiresAuth: true, roles: ['user'] },
    children: [
      { path: 'dashboard', name: 'UserDashboard', component: UserDashboardView },
      { path: 'profile', name: 'UserProfile', component: () => import('../views/user/UserProfileView.vue') },
      { path: 'courses', name: 'CourseList', component: () => import('../views/user/CourseListView.vue') },
      { path: 'purchased', name: 'PurchasedCourses', component: () => import('../views/user/PurchasedCoursesView.vue') },
      { path: 'lessons', name: 'LessonRequests', component: () => import('../views/user/LessonRequestView.vue') }
    ]
  },

  // Instructor routes (protected)
  {
    path: '/instructor',
    component: InstructorLayout,
    meta: { requiresAuth: true, roles: ['instructor'] },
    children: [
      { path: 'dashboard', name: 'InstructorDashboard', component: InstructorDashboardView },
      { path: 'profile', name: 'InstructorProfile', component: () => import('../views/instructor/InstructorProfileView.vue') },
      { path: 'lessons', name: 'InstructorLessons', component: () => import('../views/instructor/InstructorLessonsView.vue') }
    ]
  },

  // Admin routes (protected)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboardView },
      { path: 'users', name: 'UserManagement', component: () => import('../views/admin/UserManagementView.vue') },
      { path: 'courses', name: 'CourseManagement', component: () => import('../views/admin/CourseManagementView.vue') }
    ]
  },

  // Forbidden route
  { path: '/forbidden', name: 'Forbidden', component: ForbiddenView },
  // Catch-all route
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Authentication guard - temporarily disabled for testing
// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStore();
//
//   // Initialize auth if not already done
//   if (!authStore.isAuthenticated && !authStore.loading) {
//     authStore.initializeAuth();
//   }
//
//   // Check authentication for protected routes
//   if (to.meta.requiresAuth) {
//     const isAuthenticated = await authStore.checkAuth();
//
//     if (!isAuthenticated) {
//       return next({ name: 'Login', query: { redirect: to.fullPath } });
//     }
//
//     // Check role permissions
//     if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
//       return next({ name: 'Forbidden' });
//     }
//   } else {
//     // Redirect authenticated users away from auth pages
//     if (authStore.isAuthenticated && to.meta.guestOnly) {
//       const dashboard = getRoleDashboard(authStore.userRole);
//       return next({ name: dashboard });
//     }
//   }
//
//   next();
// });

// Helper function to get role-based dashboard (moved outside of store)
const getRoleDashboard = (role) => {
  const dashboards = {
    admin: 'AdminDashboard',
    instructor: 'InstructorDashboard',
    user: 'UserDashboard'
  };
  return dashboards[role] || 'UserDashboard';
};

export default router;