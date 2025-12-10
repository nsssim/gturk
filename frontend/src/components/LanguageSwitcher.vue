<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLanguage" class="form-select form-select-sm">
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
    </select>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n();

    const currentLocale = locale.value;

    const changeLanguage = (event) => {
      const newLocale = event.target.value;
      locale.value = newLocale;
      localStorage.setItem('user-locale', newLocale);
    };

    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('user-locale');
    if (savedLocale && ['en', 'tr'].includes(savedLocale)) {
      locale.value = savedLocale;
    }

    return {
      currentLocale,
      changeLanguage
    };
  }
};
</script>

<style scoped>
.language-switcher {
  display: inline-block;
  margin-left: 10px;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
  width: 100px;
  height: 30px;
}
</style>