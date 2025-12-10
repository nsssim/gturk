import { createI18n } from 'vue-i18n';

// Import language files
import en from './locales/en.json';
import tr from './locales/tr.json';

const i18n = createI18n({
  legacy: false, // Vue 3 Composition API mode
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    tr
  }
});

export default i18n;