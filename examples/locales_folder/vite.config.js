import vue from '@vitejs/plugin-vue';
import i18nResources from 'vite-plugin-i18n-resources';

export default {
  plugins: [
    vue(),
    i18nResources({
      path: 'src/locales',
    }),
  ]
}
