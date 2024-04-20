<script setup lang="ts"></script>

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
      <v-list v-model:selected="tabs" nav>
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
      <v-window v-model="tabs" direction="vertical">
        <v-window-item value="overview">Graph</v-window-item>
        <v-window-item value="settings">Settings</v-window-item>
        <v-window-item value="about">About</v-window-item>
      </v-window>
    </v-main>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      menuOpen: false,
      tabs: []
    }
  }
}
</script>

<style lang="scss"></style>
