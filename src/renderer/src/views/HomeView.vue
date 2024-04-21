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

    <v-main>
      <v-window v-model="selectedTab" direction="vertical">
        <!-- Overview -->
        <v-window-item value="overview">
          <Overview></Overview>
        </v-window-item>

        <!-- Settings -->
        <v-window-item value="settings">
          <Settings></Settings>
        </v-window-item>

        <!-- About -->
        <v-window-item value="about">
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
      menuOpen: false,
      selectedTab: []
    }
  }
}
</script>

<style lang="scss"></style>
