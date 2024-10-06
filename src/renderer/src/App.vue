<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { CustomError } from './utils/CustomError'
import { mapGetters } from 'vuex'
</script>

<template>
  <v-app class="fill-height">
    <v-locale-provider :locale="language">
      <v-theme-provider :theme="theme">
        <!-- Pages -->
        <RouterView />

        <!-- Error handling -->
        <v-dialog max-width="500" v-model="showErrorMessage">
          <v-card :title="$t('Error')">
            <v-card-text>{{ errorMessage }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="showErrorMessage = false">{{ $t('Ok') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-theme-provider>
    </v-locale-provider>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      errorMessage: '',
      themeDark: 'dark',
      themeLight: 'light',
      theme: useTheme().global.name,
      language: navigator.language,
      showErrorMessage: false
    }
  },
  watch: {
    language() {
      this.$i18n.locale = this.language
    }
  },
  methods: {
    ...mapGetters(['getLanguage', 'getTheme'])
  },
  mounted() {
    if (this.getTheme()) {
      this.theme = this.getTheme()
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = this.themeDark
    } else {
      this.theme = this.themeLight
    }

    if (this.getLanguage()) {
      this.language = this.getLanguage()
    }
  },
  errorCaptured(e: any): boolean {
    if (!(e instanceof CustomError)) {
      return true
    }

    this.errorMessage = e.message
    this.showErrorMessage = true
    return false
  }
}
</script>

<style lang="scss">
html {
  overflow-y: auto !important;
}

:root {
  --toolbar-height: 0px;
  --app-bar-height: 56px;
}

#app {
  height: calc(100dvh - var(--toolbar-height));
}

.cet-menubar {
  display: none !important;
}

.cet-container {
  --toolbar-height: 30px;
}

.tg-backdrop {
  transform: translateY(calc(-1 * var(--toolbar-height)));
}

.v-application__wrap {
  min-height: unset !important;
}
</style>
