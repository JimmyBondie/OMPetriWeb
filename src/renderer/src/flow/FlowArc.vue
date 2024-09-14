<script setup lang="ts">
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { FlowArcType } from './FlowArcType'
import { ArcType } from '@renderer/entity/intf/IArc'
import { EdgeText, GraphNode, XYPosition } from '@vue-flow/core'
import { DataClusterArc } from '@renderer/data/impl/DataClusterArc'
import { DataType } from '@renderer/data/intf/DataType'
import { UnsupportedOperationException } from '@renderer/exception/UnsupportedOperationException'
import { Weight } from '@renderer/core/Weight'
import { mapGetters } from 'vuex'
import { Function } from '@renderer/core/Function'

defineProps<{
  data: IDataArc
  source: GraphNode
  sourceX: number
  sourceY: number
  target: GraphNode
  targetX: number
  targetY: number
}>()
</script>

<template>
  <defs>
    <marker
      :id="`arrow_${data.id}`"
      viewBox="-10 -10 20 20"
      refX="0"
      refY="0"
      markerWidth="25"
      markerHeight="25"
      orient="auto-start-reverse"
    >
      <polyline
        stroke-linecap="round"
        stroke-linejoin="round"
        points="-5,-4 0,0 -5,4 -5,-4"
        style="stroke: rgb(177, 177, 183); fill: rgb(177, 177, 183); stroke-width: 1"
      ></polyline>
    </marker>
    <marker
      :id="`circle_${data.id}`"
      viewBox="-10 -10 20 20"
      refX="0"
      refY="0"
      markerWidth="25"
      markerHeight="25"
      orient="auto-start-reverse"
    >
      <circle
        r="3"
        cx="-3"
        style="stroke: rgb(177, 177, 183); fill: rgb(177, 177, 183); stroke-width: 1"
      ></circle>
    </marker>
  </defs>
  <path
    :class="'vue-flow__edge-path ' + getClass()"
    :marker-end="'url(\'#' + getMarkerEnd() + '\')'"
    :d="calcPath()"
  />
  <path class="vue-flow__edge-interaction" stroke-width="20" stroke-opacity="0" :d="calcPath()" />
  <EdgeText
    v-if="getShowArcWeights && getWeight() != ''"
    :x="(getSource().x + getTarget().x) / 2"
    :y="(getSource().y + getTarget().y) / 2"
    :label="getWeight()"
  ></EdgeText>
</template>

<script lang="ts">
export default {
  data() {
    return {
      flowType: this.getFlowArcType() as FlowArcType,
      placeHeight: 40 as number,
      transitionHeight: 40 as number,
      transitionWidth: 15 as number
    }
  },
  computed: {
    ...mapGetters(['getDefaultColor', 'getShowArcWeights'])
  },
  methods: {
    calcPath(): string {
      const source: XYPosition = this.getSource()
      const target: XYPosition = this.getTarget()
      return `M${source.x},${source.y} L ${target.x} ${target.y}`
    },
    getArcType(): ArcType {
      if (this.data instanceof DataClusterArc) {
        // DataClusterArcs should be displayed as normal arcs
        return ArcType.NORMAL
      } else {
        return this.data.arcType
      }
    },
    getClass(): string {
      switch (this.getArcType()) {
        case ArcType.TEST:
          return 'animated'
        default:
          return ''
      }
    },
    getFlowArcType(): FlowArcType {
      switch (this.data.source.type) {
        case DataType.PLACE: {
          switch (this.data.target.type) {
            case DataType.TRANSITION: {
              return FlowArcType.PLACE_TO_TRANSITION
            }

            case DataType.CLUSTER: {
              return FlowArcType.PLACE_TO_CLUSTER
            }
          }
          break
        }

        case DataType.TRANSITION: {
          switch (this.data.target.type) {
            case DataType.PLACE: {
              return FlowArcType.TRANSITION_TO_PLACE
            }

            case DataType.CLUSTER: {
              return FlowArcType.TRANSITION_TO_CLUSTER
            }
          }
          break
        }

        case DataType.CLUSTER: {
          switch (this.data.target.type) {
            case DataType.PLACE: {
              return FlowArcType.CLUSTER_TO_PLACE
            }

            case DataType.TRANSITION: {
              return FlowArcType.CLUSTER_TO_TRANSITION
            }

            case DataType.CLUSTER: {
              return FlowArcType.CLUSTER_TO_CLUSTER
            }
          }
          break
        }
      }

      throw new UnsupportedOperationException(this.$t('UnhandledElementType'))
    },
    getMarkerEnd(): string {
      switch (this.getArcType()) {
        case ArcType.INHIBITORY:
          return `circle_${this.data.id}`
        default:
          return `arrow_${this.data.id}`
      }
    },
    getSourceCircleToRectPosition(radius: number, targetHeight: number): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: this.sourceX,
        y: this.sourceY + radius + 3
      }
      const target: XYPosition = {
        x: this.targetX,
        y: this.targetY + targetHeight / 2 + 3
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
    getSourceRectToCirclePosition(
      sourceHeight: number,
      sourceWidth: number,
      targetHeight: number
    ): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: this.sourceX,
        y: this.sourceY + sourceHeight / 2 + 3
      }
      const target: XYPosition = {
        x: this.targetX,
        y: this.targetY + targetHeight / 2 + 3
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
    getSource(): XYPosition {
      switch (this.flowType) {
        case FlowArcType.PLACE_TO_TRANSITION: {
          return this.getSourceCircleToRectPosition(this.placeHeight / 2, this.transitionHeight)
        }
        case FlowArcType.TRANSITION_TO_PLACE: {
          return this.getSourceRectToCirclePosition(
            this.transitionHeight,
            this.transitionWidth,
            this.placeHeight
          )
        }
        case FlowArcType.PLACE_TO_CLUSTER: {
          return this.getSourceCircleToRectPosition(
            this.placeHeight / 2,
            this.target.dimensions.height
          )
        }
        case FlowArcType.CLUSTER_TO_PLACE: {
          return this.getSourceRectToCirclePosition(
            this.source.dimensions.height,
            this.source.dimensions.width,
            this.placeHeight
          )
        }
        case FlowArcType.TRANSITION_TO_CLUSTER: {
          return this.getSourceRectToCirclePosition(
            this.transitionHeight,
            this.transitionWidth,
            this.target.dimensions.height
          )
        }
        case FlowArcType.CLUSTER_TO_TRANSITION: {
          return this.getSourceRectToCirclePosition(
            this.source.dimensions.height,
            this.source.dimensions.width,
            this.transitionHeight
          )
        }
        case FlowArcType.CLUSTER_TO_CLUSTER: {
          return this.getSourceRectToCirclePosition(
            this.source.dimensions.height,
            this.source.dimensions.width,
            this.target.dimensions.height
          )
        }
      }
    },
    getTargetRectToCirclePosition(radius: number, sourceHeight: number): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: this.sourceX,
        y: this.sourceY + sourceHeight / 2 + 3
      }
      const target: XYPosition = {
        x: this.targetX,
        y: this.targetY + radius + 3
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
    getTargetCircleToRectPosition(
      sourceHeight: number,
      targetHeight: number,
      targetWidth: number
    ): XYPosition {
      // Calculate middle point
      const source: XYPosition = {
        x: this.sourceX,
        y: this.sourceY + sourceHeight / 2 + 3
      }
      const target: XYPosition = {
        x: this.targetX,
        y: this.targetY + targetHeight / 2 + 3
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
    getTarget(): XYPosition {
      switch (this.flowType) {
        case FlowArcType.PLACE_TO_TRANSITION: {
          return this.getTargetCircleToRectPosition(
            this.placeHeight,
            this.transitionHeight,
            this.transitionWidth
          )
        }
        case FlowArcType.TRANSITION_TO_PLACE: {
          return this.getTargetRectToCirclePosition(this.placeHeight / 2, this.transitionHeight)
        }
        case FlowArcType.PLACE_TO_CLUSTER: {
          return this.getTargetCircleToRectPosition(
            this.placeHeight,
            this.target.dimensions.height,
            this.target.dimensions.width
          )
        }
        case FlowArcType.CLUSTER_TO_PLACE: {
          return this.getTargetRectToCirclePosition(
            this.placeHeight / 2,
            this.source.dimensions.height
          )
        }
        case FlowArcType.TRANSITION_TO_CLUSTER: {
          return this.getTargetCircleToRectPosition(
            this.transitionHeight,
            this.target.dimensions.height,
            this.target.dimensions.width
          )
        }
        case FlowArcType.CLUSTER_TO_TRANSITION: {
          return this.getTargetCircleToRectPosition(
            this.source.dimensions.height,
            this.transitionHeight,
            this.transitionWidth
          )
        }
        case FlowArcType.CLUSTER_TO_CLUSTER: {
          return this.getTargetCircleToRectPosition(
            this.source.dimensions.height,
            this.target.dimensions.height,
            this.target.dimensions.width
          )
        }
      }
    },
    getWeight(): string {
      if (this.data instanceof DataClusterArc) {
        return ''
      }

      const weight: Weight | undefined = this.data.getWeight(this.getDefaultColor)
      if (!weight) {
        return ''
      }

      const func: Function = weight.function
      if (!func.isSingleElement()) {
        return ''
      }

      return func.formatString()
    }
  }
}
</script>

<style lang="scss">
.animated {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}
</style>
