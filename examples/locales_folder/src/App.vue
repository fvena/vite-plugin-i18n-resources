<template>
  <form>
    <label>{{ t('home.language') }}</label>

    <select v-model="locale">
      <option value="en">en</option>
      <option value="es">es</option>
      <option value="fr">fr</option>
    </select>
  </form>

  <p>{{ t('home.hello') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
</script>
