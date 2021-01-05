import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { messages } from "vite-i18n-resources"
import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
})

// Only if you want hot module replacement when translation message file change
if (import.meta.hot) {
  import.meta.hot.on("locales-update", (data) => {
    Object.keys(data).forEach((lang) => {
      i18n.global.setLocaleMessage(lang, data[lang]);
    });
  });
}

createApp(App).use(i18n).mount('#app')
