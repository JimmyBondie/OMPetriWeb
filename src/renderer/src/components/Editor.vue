<script setup lang="ts">
import GraphPage from './GraphPage.vue'
import InspectorPage from './InspectorPage.vue'
import SimulationPage from './SimulationPage.vue'
</script>

<template>
  <main>
    <v-bottom-navigation v-model="selectedPage">
      <v-btn prepend-icon="mdi-magnify" value="inspector">{{ $t('Inspector') }}</v-btn>
      <v-btn prepend-icon="mdi-pencil-outline" value="graph">{{ $t('Graph') }}</v-btn>
      <v-btn prepend-icon="mdi-calculator" value="simulation">{{ $t('Simulation') }}</v-btn>
    </v-bottom-navigation>

    <v-window v-model="selectedPage">
      <!-- Inspector -->
      <v-window-item value="inspector">
        <InspectorPage></InspectorPage>
      </v-window-item>

      <!-- Graph -->
      <v-window-item value="graph">
        <GraphPage></GraphPage>
      </v-window-item>

      <!-- Simulation -->
      <v-window-item value="simulation">
        <SimulationPage></SimulationPage>
      </v-window-item>
    </v-window>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedPage: ''
    }
  }
}
</script>

<style lang="scss"></style>
