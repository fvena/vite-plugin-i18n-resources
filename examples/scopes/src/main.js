import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router"
import { createI18n } from 'vue-i18n'
import { messages } from "vite-i18n-resources"
import App from './App.vue'
import Home from "./pages/home/home.vue";
import About from "./pages/about/about.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/about", component: About },
  ],
});

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

createApp(App).use(router).use(i18n).mount('#app')
