<script setup lang="ts">
import Editor from './Editor.vue'
</script>

<template>
  <main>
    <v-tabs v-model="selectedTab" bg-color="secondary">
      <!-- Tabs -->
      <v-tab v-for="tab in availableTabs" :value="tab">{{ tab }}</v-tab>

      <!-- Create new -->
      <v-tooltip :text="$t('New')" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-plus" variant="text" v-bind="props"></v-btn>
        </template>
      </v-tooltip>

      <!-- Load from file -->
      <v-tooltip :text="$t('Open')" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-open-in-app" variant="text" v-bind="props"></v-btn>
        </template>
      </v-tooltip>
    </v-tabs>

    <v-window v-model="selectedTab">
      <v-window-item v-for="tab in availableTabs" :value="tab">
        <Editor></Editor>
      </v-window-item>
    </v-window>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedTab: '',
      availableTabs: []
    }
  }
}
</script>

<style lang="scss"></style>
