<script setup lang="ts">
import { VueFlow, PanelPosition } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import FlowPlace from './FlowPlace.vue'
import FlowTransition from './FlowTransition.vue'
import FlowArc from './FlowArc.vue'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'

defineProps<{
  dao: ModelDAO
}>()
</script>

<template>
  <v-row no-gutters>
    <v-col cols="9">
      <VueFlow
        class="basicflow"
        :class="{ dark }"
        :nodes="dao.graph.nodes"
        :edges="dao.graph.connections"
        fit-view-on-init
      >
        <Background />

        <MiniMap pannable zoomable />

        <Controls :position="PanelPosition.BottomLeft"> </Controls>

        <template #node-graphPlace="props">
          <FlowPlace v-bind="props" />
        </template>
        <template #node-graphTransition="props">
          <FlowTransition v-bind="props" />
        </template>
        <template #edge-graphArc="props">
          <FlowArc v-bind="props" />
        </template>
      </VueFlow>
    </v-col>

    <v-col cols="3">
      <v-expansion-panels multiple variant="accordion">
        <v-expansion-panel :title="$t('Model')"></v-expansion-panel>
        <v-expansion-panel :title="$t('Tools')"></v-expansion-panel>
        <v-expansion-panel :title="$t('QuickView')"></v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {
      dark: useTheme().global.name.value == 'dark'
    }
  }
}
</script>

<style lang="scss">
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';

// Minimap
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';

// Controls
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';

.basicflow {
  .vue-flow__controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    border: 1px solid #fffffb;
    .vue-flow__controls-button {
      border: none;
      border-right: 1px solid #eee;
    }
  }
  &.dark {
    .vue-flow__controls {
      .vue-flow__controls-button {
        background: hsl(0, 0%, 20%);
        fill: #fffffb;
        border: none;
        &:hover {
          background: hsl(0, 0%, 30%);
        }
      }
    }
    .vue-flow__minimap {
      background-color: rgb(19, 19, 19);
    }
  }
}
</style>
