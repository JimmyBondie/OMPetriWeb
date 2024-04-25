<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useLocale } from 'vuetify'
import { mapGetters, mapMutations } from 'vuex'
</script>

<template>
  <v-app class="fill-height">
    <v-locale-provider :locale="language">
      <v-theme-provider :theme="getTheme">
        <RouterView />
      </v-theme-provider>
    </v-locale-provider>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      language: useLocale().current.value
    }
  },
  methods: {
    ...mapMutations(['applyDarkMode', 'applyLightMode'])
  },
  computed: {
    ...mapGetters(['getTheme'])
  },
  mounted() {
    if (window.matchMedia('(prefers-color-scheme: dark)')) {
      this.applyDarkMode()
    } else {
      this.applyLightMode()
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
