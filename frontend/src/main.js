import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from './i18n';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

// Initialize auth store
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');