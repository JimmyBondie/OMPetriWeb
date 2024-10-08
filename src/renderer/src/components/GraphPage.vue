<script setup lang="ts">
import {
  VueFlow,
  PanelPosition,
  NodeMouseEvent,
  VueFlowStore,
  EdgeMouseEvent,
  NodeChange,
  Connection,
  GraphNode as FlowGraphNode,
  getRectOfNodes,
  Dimensions
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
import { IDataNode } from '@renderer/data/intf/IDataNode'
import DAONameEdit from '@renderer/edits/DAONameEdit.vue'
import DAOAuthorEdit from '@renderer/edits/DAOAuthorEdit.vue'
import DAODescriptionEdit from '@renderer/edits/DAODescriptionEdit.vue'
import FlowCluster from '@renderer/flow/FlowCluster.vue'
import { DataCluster } from '@renderer/data/impl/DataCluster'
import QuickViewCluster from '@renderer/quickview/QuickViewCluster.vue'
import { DataClusterArc } from '@renderer/data/impl/DataClusterArc'
import QuickViewClusterArc from '@renderer/quickview/QuickViewClusterArc.vue'
import { GraphCluster } from '@renderer/graph/impl/GraphCluster'
import { DataException } from '@renderer/services/impl/Exceptions'
import { PlaceType } from '@renderer/entity/impl/Place'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { GraphNode } from '@renderer/graph/impl/GraphNode'

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
        :nodes="dao.graph.nodesRecursive"
        :edges="dao.graph.connectionsRecursive"
        @node-click="onSelectNode"
        @node-double-click="onDoubleClickNode"
        @nodes-change="(changes: any) => onNodesChange(changes)"
        @edge-click="onSelectEdge"
        @edge-double-click="onDoubleClickEdge"
        @pane-ready="(instance: any) => (vueFlowInstance = instance)"
        @dragover="(e: any) => onDragOver(e)"
        @dragleave="onDragLeave"
        @drop="(e: any) => onDrop(e)"
        @keydown="(e: any) => onKeyDown(e)"
        @connect="(params: any) => onConnect(params)"
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
        <template #node-graphCluster="props">
          <FlowCluster v-bind="props" />
        </template>
        <template #edge-graphArc="props">
          <FlowArc
            :data="props.data"
            :source="props.sourceNode"
            :source-x="props.sourceX"
            :source-y="props.sourceY"
            :target="props.targetNode"
            :target-x="props.targetX"
            :target-y="props.targetY"
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
            <DAONameEdit :dao="dao"></DAONameEdit>

            <!-- Author -->
            <DAOAuthorEdit :dao="dao"></DAOAuthorEdit>

            <!-- Description -->
            <DAODescriptionEdit :dao="dao"></DAODescriptionEdit>

            <v-btn
              block
              prepend-icon="mdi-content-save-edit-outline"
              color="info"
              @click="saveModel(dao)"
            >
              {{ $t('Save') }}
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Tools -->
        <v-expansion-panel :title="$t('Tools')" value="tools">
          <v-expansion-panel-text>
            <v-row>
              <!-- New discrete place -->
              <v-col class="d-flex justify-center">
                <v-tooltip :text="$t('NewDiscretePlace')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="rounded-circle cursor-grab"
                      height="40"
                      width="40"
                      color="green-darken-2"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="
                        (e: DragEvent) =>
                          onDragStart(e, { dataType: DataType.PLACE, elemType: PlaceType.DISCRETE })
                      "
                    >
                      <v-card-title
                        style="line-height: 40px; user-select: none"
                        class="pa-0 text-center text-caption user-select-none"
                      >
                        1
                      </v-card-title>
                    </v-card>
                  </template>
                </v-tooltip>
              </v-col>

              <!-- New continuous place -->
              <v-col class="d-flex justify-center">
                <v-tooltip :text="$t('NewContinuousPlace')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="rounded-circle cursor-grab"
                      height="40"
                      width="40"
                      color="green-darken-2"
                      border="opacity-50 double lg"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="
                        (e: DragEvent) =>
                          onDragStart(e, {
                            dataType: DataType.PLACE,
                            elemType: PlaceType.CONTINUOUS
                          })
                      "
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

              <!-- New discrete transition -->
              <v-col class="d-flex justify-center">
                <v-tooltip :text="$t('NewDiscreteTransition')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="pa-1 cursor-grab"
                      color="blue-darken-2"
                      width="15"
                      height="40"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="
                        (e: DragEvent) =>
                          onDragStart(e, {
                            dataType: DataType.TRANSITION,
                            elemType: TransitionType.DISCRETE
                          })
                      "
                    ></v-card>
                  </template>
                </v-tooltip>
              </v-col>

              <!-- New continuous transition -->
              <v-col class="d-flex justify-center">
                <v-tooltip :text="$t('NewContinuousTransition')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="pa-1 cursor-grab"
                      color="blue-darken-2"
                      width="15"
                      height="40"
                      border="opacity-50 double lg"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="
                        (e: DragEvent) =>
                          onDragStart(e, {
                            dataType: DataType.TRANSITION,
                            elemType: TransitionType.CONTINUOUS
                          })
                      "
                    ></v-card>
                  </template>
                </v-tooltip>
              </v-col>

              <!-- New stochastic transition -->
              <v-col class="d-flex justify-center">
                <v-tooltip :text="$t('NewStochasticTransition')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="pa-1 cursor-grab"
                      color="blue-darken-4"
                      width="15"
                      height="40"
                      v-bind="tooltip"
                      draggable="true"
                      @dragstart="
                        (e: DragEvent) =>
                          onDragStart(e, {
                            dataType: DataType.TRANSITION,
                            elemType: TransitionType.STOCHASTIC
                          })
                      "
                    ></v-card>
                  </template>
                </v-tooltip>
              </v-col>

              <!-- New cluster -->
              <v-col class="d-flex justify-center">
                <v-tooltip :text="$t('NewCluster')" location="top">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-card
                      class="d-flex justify-center align-center pa-1"
                      width="60"
                      height="40"
                      variant="tonal"
                      v-bind="tooltip"
                      @click="clusterSelectedElements"
                    >
                      <v-icon icon="mdi-plus"></v-icon>
                    </v-card>
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

          <!-- Clusters -->
          <v-expansion-panel-text v-if="selectedDataElement instanceof DataCluster">
            <QuickViewCluster
              :dao="dao"
              :cluster="selectedDataElement"
              :shape="<IGraphElement>selectedGraphElement"
            ></QuickViewCluster>
          </v-expansion-panel-text>

          <!-- Cluster Arcs -->
          <v-expansion-panel-text v-if="selectedDataElement instanceof DataClusterArc">
            <QuickViewClusterArc
              :dao="dao"
              :clusterArc="selectedDataElement"
              :shape="<IGraphElement>selectedGraphElement"
            ></QuickViewClusterArc>
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
      copyCut: false,
      copyElements: [] as Array<IGraphNode>,
      draggedType: undefined as
        | { dataType: DataType.PLACE; elemType: PlaceType }
        | { dataType: DataType.TRANSITION; elemType: TransitionType }
        | undefined,
      isDragging: false,
      isDragOver: false,
      openPanels: ['model', 'tools'],
      selectedDataElement: undefined as IDataElement | undefined,
      selectedGraphElement: undefined as IGraphElement | undefined,
      vueFlowInstance: undefined as VueFlowStore | undefined
    }
  },
  methods: {
    ...mapMutations([
      'connect',
      'createCluster',
      'createNode',
      'paste',
      'removeElements',
      'saveModel'
    ]),
    clusterSelectedElements() {
      if (!this.vueFlowInstance) {
        return
      }
      const selected: Array<FlowGraphNode> = this.vueFlowInstance.getSelectedNodes
      const shapes: Array<IGraphElement> = new Array<IGraphElement>()
      for (const node of selected) {
        for (const shape of (node.data as IDataNode).shapes) {
          if (node.id == shape.id) {
            shapes.push(shape)
            break
          }
        }
      }

      this.createCluster({ dao: this.dao, selected: shapes })
    },
    onConnect(params: Connection) {
      if (!this.vueFlowInstance) {
        return
      }

      const source: FlowGraphNode<IDataNode, any, string> | undefined =
        this.vueFlowInstance.findNode(params.source)
      if (!source) {
        return
      }

      let sourceShape: IGraphElement | undefined = undefined
      for (const shape of source.data.shapes) {
        if (shape.id == params.source) {
          sourceShape = shape
          break
        }
      }
      if (!sourceShape) {
        return
      }

      const target: FlowGraphNode<IDataNode, any, string> | undefined =
        this.vueFlowInstance.findNode(params.target)
      if (!target) {
        return
      }

      let targetShape: IGraphElement | undefined = undefined
      for (const shape of target.data.shapes) {
        if (shape.id == params.target) {
          targetShape = shape
          break
        }
      }
      if (!targetShape) {
        return
      }

      this.connect({ dao: this.dao, source: sourceShape, target: targetShape })
    },
    onDoubleClickEdge(event: EdgeMouseEvent) {
      if (!(event.edge.data instanceof DataClusterArc)) {
        this.onOpenInspector(event.edge.data)
      }
    },
    onDoubleClickNode(event: NodeMouseEvent) {
      if (!(event.node.data instanceof DataCluster)) {
        this.onOpenInspector(event.node.data)
      }
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
    onDragStart(
      event: DragEvent,
      type:
        | { dataType: DataType.PLACE; elemType: PlaceType }
        | { dataType: DataType.TRANSITION; elemType: TransitionType }
    ) {
      if (this.vueFlowInstance) {
        this.vueFlowInstance.removeSelectedNodes(this.vueFlowInstance.getSelectedNodes)
      }
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

      const selectedNodes: Array<FlowGraphNode> = this.vueFlowInstance.getSelectedNodes
      let cluster: DataCluster | null = null
      if (selectedNodes.length > 1) {
        throw new DataException(this.$t('CannotCreateInMultipleClusters'))
      } else if (selectedNodes.length == 1) {
        const selected: IDataNode = selectedNodes[0].data
        if (selected instanceof DataCluster) {
          cluster = selected
        } else {
          throw new DataException(this.$t('PleaseSelectCluster'))
        }
      }

      const position = this.vueFlowInstance.screenToFlowCoordinate({
        x: event.clientX,
        y: event.clientY
      })

      if (cluster) {
        position.x -= selectedNodes[0].position.x
        position.y -= selectedNodes[0].position.y
      }

      this.createNode({
        dao: this.dao,
        cluster: cluster,
        type: this.draggedType,
        posX: position.x,
        posY: position.y
      })
    },
    onKeyDown(event: KeyboardEvent) {
      if (!this.vueFlowInstance) {
        return
      }

      if (
        event.key != 'Delete' &&
        !(event.ctrlKey && event.key == 'c') &&
        !(event.ctrlKey && event.key == 'x') &&
        !(event.ctrlKey && event.key == 'v')
      ) {
        return
      }

      event.preventDefault()

      const selected: Array<FlowGraphNode> = this.vueFlowInstance.getSelectedNodes
      const shapes: Array<IGraphElement> = new Array<IGraphElement>()
      for (const node of selected) {
        for (const shape of (node.data as IDataNode).shapes) {
          if (node.id == shape.id) {
            shapes.push(shape)
            break
          }
        }
      }

      if (event.key == 'Delete') {
        if (shapes.length > 0) {
          this.removeElements({ dao: this.dao, elements: shapes })
        }
      } else if (event.ctrlKey && event.key == 'c') {
        this.copyCut = false
        this.copyElements = shapes.filter<GraphNode>(
          (value: IGraphElement): value is GraphNode => value instanceof GraphNode
        )
      } else if (event.ctrlKey && event.key == 'x') {
        this.copyCut = true
        this.copyElements = shapes.filter<GraphNode>(
          (value: IGraphElement): value is GraphNode => value instanceof GraphNode
        )
      } else if (event.ctrlKey && event.key == 'v') {
        if (this.copyElements.length > 0) {
          this.paste({ dao: this.dao, nodes: this.copyElements, cut: this.copyCut })
        }
      }
    },
    onNodesChange(changes: NodeChange[]) {
      if (!this.vueFlowInstance) {
        return
      }

      for (const change of changes) {
        if (
          change.type != 'dimensions' &&
          (change.type != 'position' || !change.dragging || !change.position)
        ) {
          continue
        }

        const allNodes: Array<IGraphNode> = this.dao.graph.nodesRecursive
        const node: IGraphNode | undefined = allNodes.find(
          (value: IGraphNode) => value.id == change.id
        )
        if (!node) {
          continue
        }

        if (change.type == 'position') {
          node.position = change.position
          continue
        } else if (node instanceof GraphCluster) {
          const children: Array<IGraphNode> = node.graph.nodesRecursive
          const flowChilds: Array<FlowGraphNode> = new Array<FlowGraphNode>()
          for (const shape of children) {
            const found: FlowGraphNode | undefined = this.vueFlowInstance.findNode(shape.id)
            if (found) {
              flowChilds.push(found)
            }
          }
          const dimensions: Dimensions = getRectOfNodes(flowChilds)
          const element: Element | null = document.querySelector(`[data-id="${change.id}"]`)
          if (element instanceof HTMLDivElement) {
            element.style.height = `${dimensions.height}px`
            element.style.width = `${dimensions.width}px`
          }
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

// Resizer
@import '@vue-flow/node-resizer/dist/style.css';

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
    .vue-flow__edge-textbg {
      fill: rgb(19, 19, 19);
    }
    .vue-flow__edge-text {
      fill: #fffffb;
    }
  }
}
</style>
