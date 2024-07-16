<script setup lang="ts">
import SimulationPage from '@renderer/components/SimulationPage.vue'
import About from '../components/About.vue'
import Overview from '../components/Overview.vue'
import Settings from '../components/Settings.vue'
</script>

<template>
  <main class="h-100">
    <v-app-bar style="position: unset" density="comfortable" color="blue">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="menuOpen = !menuOpen"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>OMPetriWeb</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="menuOpen"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
    >
      <v-list v-model:selected="selectedTab" nav mandatory>
        <v-list-item prepend-icon="mdi-graph-outline" value="overview">
          {{ $t('Overview') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-calculator-variant-outline" value="simulations">
          {{ $t('Simulations') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-cog-outline" value="settings">
          {{ $t('Settings') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-information-outline" value="about">
          {{ $t('About') }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="height: calc(100% - var(--app-bar-height))">
      <v-window v-model="selectedTab[0]" direction="vertical" class="h-100">
        <!-- Overview -->
        <v-window-item value="overview" class="h-100">
          <Overview class="h-100"></Overview>
        </v-window-item>

        <v-window-item value="simulations" class="h-100">
          <SimulationPage class="h-100"></SimulationPage>
        </v-window-item>

        <!-- Settings -->
        <v-window-item value="settings" class="h-100">
          <Settings class="h-100"></Settings>
        </v-window-item>

        <!-- About -->
        <v-window-item value="about" class="h-100 overflow-auto">
          <About></About>
        </v-window-item>
      </v-window>
    </v-main>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      menuOpen: true,
      selectedTab: [] as Array<string>
    }
  }
}
</script>

<style lang="scss">
.v-navigation-drawer {
  z-index: 2004 !important;
}

.v-navigation-drawer__scrim {
  z-index: 2003 !important;
}

.v-navigation-drawer--left {
  top: calc(var(--app-bar-height) + var(--toolbar-height)) !important;
  height: calc(100% - var(--app-bar-height) - var(--toolbar-height)) !important;
}

.v-main {
  --v-layout-top: 0px !important ;
}
</style>
