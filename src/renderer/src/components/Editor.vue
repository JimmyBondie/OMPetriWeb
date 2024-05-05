<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import GraphPage from './GraphPage.vue'
import InspectorPage from '../inspector/InspectorPage.vue'
import SimulationPage from './SimulationPage.vue'
import { IDataNode } from '@renderer/data/intf/IDataNode'

defineProps<{
  dao: ModelDAO
}>()
</script>

<template>
  <main>
    <v-bottom-navigation v-model="selectedPage">
      <v-btn prepend-icon="mdi-magnify" value="inspector">{{ $t('Inspector') }}</v-btn>
      <v-btn prepend-icon="mdi-pencil-outline" value="graph">{{ $t('Graph') }}</v-btn>
      <v-btn prepend-icon="mdi-calculator" value="simulation">{{ $t('Simulation') }}</v-btn>
    </v-bottom-navigation>

    <v-window v-model="selectedPage" class="h-100">
      <!-- Inspector -->
      <v-window-item value="inspector" class="h-100">
        <InspectorPage
          class="h-100"
          :activeNode="<IDataNode | undefined>selectedNode"
          :dao="dao"
        ></InspectorPage>
      </v-window-item>

      <!-- Graph -->
      <v-window-item value="graph" class="h-100">
        <GraphPage class="h-100" :dao="dao" :on-open-inspector="onOpenInspector"></GraphPage>
      </v-window-item>

      <!-- Simulation -->
      <v-window-item value="simulation" class="h-100">
        <SimulationPage class="h-100"></SimulationPage>
      </v-window-item>
    </v-window>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      selectedNode: undefined as IDataNode | undefined,
      selectedPage: 'graph'
    }
  },
  methods: {
    onOpenInspector(node: IDataNode) {
      this.selectedNode = node
      this.selectedPage = 'inspector'
    }
  }
}
</script>

<style lang="scss"></style>
