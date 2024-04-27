<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
</script>

<template>
  <v-app class="fill-height">
    <v-locale-provider :locale="language">
      <v-theme-provider :theme="theme">
        <RouterView />
      </v-theme-provider>
    </v-locale-provider>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      themeDark: 'dark',
      themeLight: 'light',
      theme: useTheme().global.name,
      language: navigator.language
    }
  },
  watch: {
    language() {
      this.$i18n.locale = this.language
    }
  },
  mounted() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = this.themeDark
    } else {
      this.theme = this.themeLight
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: auto !important;
}

.cet-menubar {
  display: none !important;
}

.v-application__wrap {
  min-height: unset !important;
}
</style>
