import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './AppSimple.vue';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simple router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App
    },
    {
      path: '/about',
      component: () => import('./views/AboutView.vue')
    }
  ]
});

const app = createApp(App);
app.use(router);
app.mount('#app');