<script setup lang="ts">
import { VueFlow, PanelPosition, NodeMouseEvent, VueFlowStore } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { PerfectArrow } from '@vue-flow/pathfinding-edge'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import FlowPlace from './FlowPlace.vue'
import FlowTransition from './FlowTransition.vue'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import QuickViewPlace from '@renderer/quickview/QuickViewPlace.vue'
import QuickViewTransition from '@renderer/quickview/QuickViewTransition.vue'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

defineProps<{
  activeElement?: IGraphElement
  dao: ModelDAO
  onOpenInspector: (node: IDataNode) => void
}>()
</script>

<template>
  <v-row no-gutters>
    <!-- Graph -->
    <v-col class="h-100" cols="9">
      <VueFlow
        class="basicflow"
        :class="{ dark: useTheme().current.value.dark }"
        :nodes="dao.graph.nodes"
        :edges="dao.graph.connections"
        @node-click="onSelectNode"
        @node-double-click="onDoubleClickNode"
        @pane-ready="(instance: any) => (vueFlowInstance = instance)"
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
        <template #edge-pathFinding="props">
          <PerfectArrow v-bind="props" />
        </template>
      </VueFlow>
    </v-col>

    <!-- Panels -->
    <v-col class="h-100 overflow-x-auto" cols="3">
      <v-expansion-panels multiple v-model="openPanels">
        <!-- Model -->
        <v-expansion-panel :title="$t('Model')" value="model">
          <v-expansion-panel-text>
            <!-- Name -->
            <v-text-field
              :label="$t('Name')"
              v-model="dao.name"
              variant="underlined"
              prepend-icon="mdi-rename-outline"
              density="compact"
            ></v-text-field>

            <!-- Author -->
            <v-text-field
              :label="$t('Author')"
              v-model="dao.author"
              variant="underlined"
              prepend-icon="mdi-account-outline"
              density="compact"
            ></v-text-field>

            <!-- Description -->
            <v-textarea
              :label="$t('Description')"
              v-model="dao.description"
              persistent-placeholder
              :placeholder="$t('EnterDescription')"
              variant="underlined"
              prepend-icon="mdi-text"
              density="compact"
            ></v-textarea>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Tools -->
        <v-expansion-panel :title="$t('Tools')" value="tools"></v-expansion-panel>

        <!-- QuickView -->
        <v-expansion-panel :title="$t('QuickView')" value="quickview" v-if="selectedNode">
          <!-- Places -->
          <v-expansion-panel-text v-if="selectedNode instanceof DataPlace">
            <QuickViewPlace :place="selectedNode"></QuickViewPlace>
          </v-expansion-panel-text>

          <!-- Transitions -->
          <v-expansion-panel-text v-if="selectedNode instanceof DataTransition">
            <QuickViewTransition :dao="dao" :transition="selectedNode"></QuickViewTransition>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {
      openPanels: ['model', 'tools'],
      selectedNode: undefined as IDataNode | undefined,
      vueFlowInstance: undefined as VueFlowStore | undefined
    }
  },
  methods: {
    onDoubleClickNode(event: NodeMouseEvent) {
      if (event && event.node && event.node.data) {
        this.onOpenInspector(event.node.data)
      }
    },
    onSelectNode(event: NodeMouseEvent) {
      if (!event || !event.node) {
        return
      }

      this.selectedNode = event.node.data
      if (this.selectedNode && !this.openPanels.includes('quickview')) {
        this.openPanels.push('quickview')
      }
    }
  },
  watch: {
    activeElement() {
      if (this.vueFlowInstance && this.activeElement) {
        this.vueFlowInstance.fitView({ nodes: [this.activeElement.id] })
      }
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
@import '@vue-flow/minimap/dist/style.css';

// Controls
@import '@vue-flow/controls/dist/style.css';

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
