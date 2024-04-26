<script setup lang="ts">
import About from '../components/About.vue'
import Overview from '../components/Overview.vue'
import Settings from '../components/Settings.vue'
</script>

<template>
  <main>
    <v-app-bar density="comfortable" color="blue">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="menuOpen = !menuOpen"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>OMPetriWeb</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="menuOpen"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
    >
      <v-list v-model:selected="selectedTab" nav>
        <v-list-item prepend-icon="mdi-graph-outline" value="overview">
          {{ $t('Overview') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-cog-outline" value="settings">
          {{ $t('Settings') }}
        </v-list-item>
        <v-list-item prepend-icon="mdi-information-outline" value="about">
          {{ $t('About') }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="h-screen" :class="{ 'no-bottom-bar': !selectedTab.includes('overview') }">
      <v-window v-model="selectedTab" direction="vertical" class="h-100">
        <!-- Overview -->
        <v-window-item value="overview" class="h-100">
          <Overview class="h-100"></Overview>
        </v-window-item>

        <!-- Settings -->
        <v-window-item value="settings" class="h-100">
          <Settings class="h-100"></Settings>
        </v-window-item>

        <!-- About -->
        <v-window-item value="about" class="h-100">
          <About class="h-100"></About>
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
.no-bottom-bar {
  --v-layout-bottom: 0 !important;
}
</style>
