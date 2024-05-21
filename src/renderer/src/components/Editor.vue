<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import GraphPage from './GraphPage.vue'
import InspectorPage from '../inspector/InspectorPage.vue'
import SimulationPage from './SimulationPage.vue'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

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

    <v-window v-model="selectedPage" class="window-without-bottom-bar">
      <!-- Inspector -->
      <v-window-item value="inspector" class="h-100">
        <InspectorPage
          class="h-100"
          :activeElement="<IDataElement | undefined>selectedElement"
          :dao="dao"
          :on-show-element="
            (element: IGraphElement) => {
              activeElement = element
              selectedPage = 'graph'
            }
          "
        ></InspectorPage>
      </v-window-item>

      <!-- Graph -->
      <v-window-item value="graph" class="h-100">
        <GraphPage
          class="h-100"
          :dao="dao"
          :active-element="<IGraphElement | undefined>activeElement"
          :on-open-inspector="onOpenInspector"
        ></GraphPage>
      </v-window-item>

      <!-- Simulation -->
      <v-window-item value="simulation" class="h-100">
        <SimulationPage :dao="dao" class="h-100"></SimulationPage>
      </v-window-item>
    </v-window>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      activeElement: undefined as IGraphElement | undefined,
      selectedElement: undefined as IDataElement | undefined,
      selectedPage: 'graph'
    }
  },
  methods: {
    onOpenInspector(element: IDataElement) {
      this.selectedElement = element
      this.selectedPage = 'inspector'
    }
  }
}
</script>

<style lang="scss">
.window-without-bottom-bar {
  height: calc(100% - var(--app-bar-height));
  .v-window__container {
    height: 100%;
  }
}
</style>
