<script setup lang="ts">
import { useLocale, useTheme } from 'vuetify/lib/framework.mjs'
</script>

<template>
  <v-card :title="$t('Settings')">
    <v-list max-width="300px">
      <v-list-subheader>{{ $t('General') }}</v-list-subheader>

      <!-- Language -->
      <v-list-item>
        <v-list-item-title>{{ $t('Language') }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-select
            v-model="language"
            :items="languageItems"
            item-title="name"
            item-value="code"
            density="compact"
            :open-text="$t('Open')"
            :close-text="$t('Close')"
            :no-data-text="$t('NoDataAvailable')"
          ></v-select>
        </v-list-item-subtitle>
      </v-list-item>

      <!-- Theme -->
      <v-list-item>
        <v-list-item-title>{{ $t('Design') }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-btn
            v-if="theme == themeDark"
            @click="() => (theme = themeLight)"
            prepend-icon="mdi-weather-sunny"
            variant="tonal"
          >
            {{ $t('Light') }}
          </v-btn>
          <v-btn
            v-if="theme != themeDark"
            @click="() => (theme = themeDark)"
            prepend-icon="mdi-weather-night"
            variant="tonal"
          >
            {{ $t('Dark') }}
          </v-btn>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      themeDark: 'dark',
      themeLight: 'light',
      theme: useTheme().global.name,
      language: useLocale().current.value,
      languageItems: [
        {
          name: 'Deutsch',
          code: 'de'
        },
        {
          name: 'English',
          code: 'en'
        }
      ]
    }
  },
  watch: {
    language() {
      this.$i18n.locale = this.language
    }
  }
}
</script>

<style lang="scss"></style>
