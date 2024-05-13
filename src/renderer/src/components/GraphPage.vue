<script setup lang="ts">
import {
  VueFlow,
  PanelPosition,
  NodeMouseEvent,
  VueFlowStore,
  EdgeMouseEvent,
  XYPosition,
  EdgeProps,
  NodeChange
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import FlowArc from '../flow/FlowArc.vue'
import FlowPlace from '../flow/FlowPlace.vue'
import FlowTransition from '../flow/FlowTransition.vue'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { DataArc } from '@renderer/data/impl/DataArc'
import QuickViewPlace from '@renderer/quickview/QuickViewPlace.vue'
import QuickViewTransition from '@renderer/quickview/QuickViewTransition.vue'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import QuickViewArc from '@renderer/quickview/QuickViewArc.vue'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { DataType } from '@renderer/data/intf/DataType'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { mapMutations } from 'vuex'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

defineProps<{
  activeElement?: IGraphElement
  dao: ModelDAO
  onOpenInspector: (element: IDataElement) => void
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
        @nodes-change="(changes: any) => onNodesChange(changes)"
        @edge-click="onSelectEdge"
        @edge-double-click="onDoubleClickEdge"
        @pane-ready="(instance: any) => (vueFlowInstance = instance)"
        @dragover="(e: any) => onDragOver(e)"
        @dragleave="onDragLeave"
        @drop="(e: any) => onDrop(e)"
        fit-view-on-init
      >
        <Background
          :style="{
            backgroundColor: isDragOver ? 'grey' : 'transparent',
            transition: 'background-color 0.2s ease'
          }"
        />

        <MiniMap pannable zoomable />

        <Controls :position="PanelPosition.BottomLeft"> </Controls>

        <template #node-graphPlace="props">
          <FlowPlace v-bind="props" />
        </template>
        <template #node-graphTransition="props">
          <FlowTransition v-bind="props" />
        </template>
        <template #edge-placeToTransition="props">
          <FlowArc
            :data="props.data"
            :source-x="getSourcePlacePosition(props, 20, 40).x"
            :source-y="getSourcePlacePosition(props, 20, 40).y"
            :target-x="getTargetTransitionPosition(props, 40, 40, 15).x"
            :target-y="getTargetTransitionPosition(props, 40, 40, 15).y"
          />
        </template>
        <template #edge-transitionToPlace="props">
          <FlowArc
            :data="props.data"
            :source-x="getSourceTransitionPosition(props, 40, 15, 40).x"
            :source-y="getSourceTransitionPosition(props, 40, 15, 40).y"
            :target-x="getTargetPlacePosition(props, 20, 15).x"
            :target-y="getTargetPlacePosition(props, 20, 15).y"
          />
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
        <v-expansion-panel :title="$t('Tools')" value="tools">
          <v-expansion-panel-text>
            <v-row>
              <v-col class="d-flex justify-center">
                <!-- New place -->
                <v-tooltip :text="$t('NewPlace')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="rounded-circle cursor-grab"
                      height="40"
                      width="40"
                      color="green-darken-2"
                      border="opacity-50 double lg"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="(e: DragEvent) => onDragStart(e, DataType.PLACE)"
                    >
                      <v-card-title
                        style="line-height: 32px; user-select: none"
                        class="pa-0 text-center text-caption user-select-none"
                      >
                        1.00
                      </v-card-title>
                    </v-card>
                  </template>
                </v-tooltip>
              </v-col>

              <v-col class="d-flex justify-center">
                <!-- New transition -->
                <v-tooltip :text="$t('NewTransition')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="pa-1 cursor-grab"
                      color="blue-darken-2"
                      width="15"
                      height="40"
                      border="opacity-50 double lg"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="(e: DragEvent) => onDragStart(e, DataType.TRANSITION)"
                    ></v-card>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- QuickView -->
        <v-expansion-panel
          :title="$t('QuickView')"
          value="quickview"
          v-if="selectedDataElement && selectedGraphElement"
        >
          <!-- Places -->
          <v-expansion-panel-text v-if="selectedDataElement instanceof DataPlace">
            <QuickViewPlace
              :dao="dao"
              :place="selectedDataElement"
              :shape="<IGraphElement>selectedGraphElement"
            ></QuickViewPlace>
          </v-expansion-panel-text>

          <!-- Transitions -->
          <v-expansion-panel-text v-if="selectedDataElement instanceof DataTransition">
            <QuickViewTransition
              :dao="dao"
              :transition="selectedDataElement"
              :shape="<IGraphElement>selectedGraphElement"
            ></QuickViewTransition>
          </v-expansion-panel-text>

          <!-- Arcs -->
          <v-expansion-panel-text v-if="selectedDataElement instanceof DataArc">
            <QuickViewArc
              :dao="dao"
              :arc="selectedDataElement"
              :shape="<IGraphElement>selectedGraphElement"
            ></QuickViewArc>
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
      draggedType: undefined as DataType | undefined,
      isDragging: false,
      isDragOver: false,
      openPanels: ['model', 'tools'],
      selectedDataElement: undefined as IDataElement | undefined,
      selectedGraphElement: undefined as IGraphElement | undefined,
      vueFlowInstance: undefined as VueFlowStore | undefined
    }
  },
  methods: {
    ...mapMutations(['createNode']),
    getSourcePlacePosition(props: EdgeProps, radius: number, targetHeight: number): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: props.sourceX,
        y: props.sourceY + radius + 3
      }
      const target: XYPosition = {
        x: props.targetX,
        y: props.targetY + targetHeight / 2 + 3
      }

      let connection: XYPosition = {
        x: target.x - source.x,
        y: target.y - source.y
      }

      const length: number = Math.sqrt(Math.pow(connection.x, 2) + Math.pow(connection.y, 2))
      connection = {
        x: (connection.x / length) * (radius + 5),
        y: (connection.y / length) * (radius + 5)
      }

      return {
        x: source.x + connection.x,
        y: source.y + connection.y
      }
    },
    getSourceTransitionPosition(
      props: EdgeProps,
      sourceHeight: number,
      sourceWidth: number,
      targetHeight: number
    ): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: props.sourceX,
        y: props.sourceY + sourceHeight / 2 + 3
      }
      const target: XYPosition = {
        x: props.targetX,
        y: props.targetY + targetHeight / 2 + 3
      }

      let connection: XYPosition = {
        x: target.x - source.x,
        y: target.y - source.y
      }

      // Enlarge the target for a margin
      sourceWidth = sourceWidth + 10
      sourceHeight = sourceHeight + 10
      if (Math.abs(connection.x / sourceWidth) <= Math.abs(connection.y / sourceHeight)) {
        const y: number = Math.sign(connection.y) * (sourceHeight / 2)
        connection = {
          x: y * (connection.x / connection.y),
          y: y
        }
      } else {
        const x: number = Math.sign(connection.x) * (sourceWidth / 2)
        connection = {
          x: x,
          y: x * (connection.y / connection.x)
        }
      }

      return {
        x: source.x + connection.x,
        y: source.y + connection.y
      }
    },
    getTargetPlacePosition(props: EdgeProps, radius: number, sourceHeight: number): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: props.sourceX,
        y: props.sourceY + sourceHeight / 2 + 3
      }
      const target: XYPosition = {
        x: props.targetX,
        y: props.targetY + radius + 3
      }

      let connection: XYPosition = {
        x: source.x - target.x,
        y: source.y - target.y
      }

      const length: number = Math.sqrt(Math.pow(connection.x, 2) + Math.pow(connection.y, 2))
      connection = {
        x: (connection.x / length) * (radius + 5),
        y: (connection.y / length) * (radius + 5)
      }

      return {
        x: target.x + connection.x,
        y: target.y + connection.y
      }
    },
    getTargetTransitionPosition(
      props: EdgeProps,
      sourceHeight: number,
      targetHeight: number,
      targetWidth: number
    ): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: props.sourceX,
        y: props.sourceY + sourceHeight / 2 + 3
      }
      const target: XYPosition = {
        x: props.targetX,
        y: props.targetY + targetHeight / 2 + 3
      }

      let connection: XYPosition = {
        x: source.x - target.x,
        y: source.y - target.y
      }

      // Enlarge the target for a margin
      targetWidth = targetWidth + 10
      targetHeight = targetHeight + 10
      if (Math.abs(connection.x / targetWidth) <= Math.abs(connection.y / targetHeight)) {
        const y: number = Math.sign(connection.y) * (targetHeight / 2)
        connection = {
          x: y * (connection.x / connection.y),
          y: y
        }
      } else {
        const x: number = Math.sign(connection.x) * (targetWidth / 2)
        connection = {
          x: x,
          y: x * (connection.y / connection.x)
        }
      }

      return {
        x: target.x + connection.x,
        y: target.y + connection.y
      }
    },
    onDoubleClickEdge(event: EdgeMouseEvent) {
      this.onOpenInspector(event.edge.data)
    },
    onDoubleClickNode(event: NodeMouseEvent) {
      this.onOpenInspector(event.node.data)
    },
    onDragEnd() {
      this.isDragging = false
      this.isDragOver = false
      this.draggedType = undefined
      document.removeEventListener('drop', this.onDragEnd)
    },
    onDragLeave() {
      this.isDragOver = false
    },
    onDragOver(event: DragEvent) {
      event.preventDefault()
      if (this.draggedType) {
        this.isDragOver = true
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'move'
        }
      }
    },
    onDragStart(event: DragEvent, type: DataType) {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
      }

      this.draggedType = type
      this.isDragging = true

      document.addEventListener('drop', this.onDragEnd)
    },
    onDrop(event: DragEvent) {
      if (!this.vueFlowInstance) {
        return
      }

      const position = this.vueFlowInstance.screenToFlowCoordinate({
        x: event.clientX,
        y: event.clientY
      })

      this.createNode({ dao: this.dao, type: this.draggedType, posX: position.x, posY: position.y })
    },
    onNodesChange(changes: NodeChange[]) {
      if (!this.vueFlowInstance) {
        return
      }

      for (const change of changes) {
        if (change.type != 'position' || !change.dragging || !change.position) {
          continue
        }

        const node: IGraphNode | undefined = this.dao.graph.nodes.find(
          (value: IGraphNode) => value.id == change.id
        )

        if (node) {
          node.position = change.position
        }
      }
    },
    onSelectEdge(event: EdgeMouseEvent) {
      this.onSelectElement(event.edge.data, event.edge.id)
    },
    onSelectElement(element: IDataElement, shapeId: string) {
      this.selectedDataElement = element
      this.selectedGraphElement = undefined
      for (const shape of element.shapes) {
        if (shape.id == shapeId) {
          this.selectedGraphElement = shape
          break
        }
      }

      if (
        this.selectedDataElement &&
        this.selectedGraphElement &&
        !this.openPanels.includes('quickview')
      ) {
        this.openPanels.push('quickview')
      }
    },
    onSelectNode(event: NodeMouseEvent) {
      this.onSelectElement(event.node.data, event.node.id)
    }
  },
  watch: {
    activeElement() {
      if (this.vueFlowInstance && this.activeElement) {
        if (this.activeElement.data.type == DataType.ARC) {
          const arc: IGraphArc = this.activeElement as IGraphArc
          this.vueFlowInstance.fitView({
            nodes: [arc.sourceNode.id, arc.targetNode.id],
            offset: {
              x: 320,
              y: 75
            }
          })
        } else {
          this.vueFlowInstance.fitView({
            nodes: [this.activeElement.id],
            offset: {
              x: 295,
              y: 85
            }
          })
        }
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
