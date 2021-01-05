<template>
  <form>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="es">es</option>
      <option value="fr">fr</option>
    </select>
  </form>

  <nav>
    <router-link to="/">{{ t('home.link')}}</router-link>
    <router-link to="/about">{{ t('about.link')}}</router-link>
  </nav>

  <router-view></router-view>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
</script>

<style lang="css" scoped>
a {
  margin: 0 0.5rem;
}
</style>
