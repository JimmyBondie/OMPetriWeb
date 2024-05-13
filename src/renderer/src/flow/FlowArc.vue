<script setup lang="ts">
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { FlowArcType } from './FlowArcType'
import { ArcType } from '@renderer/entity/intf/IArc'
import { XYPosition } from '@vue-flow/core'

defineProps<{
  data: IDataArc
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  flowType: FlowArcType
}>()
</script>

<template>
  <defs>
    <marker
      id="arrow"
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
      id="circle"
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
</template>

<script lang="ts">
export default {
  methods: {
    calcPath(): string {
      const source: XYPosition = this.getSource()
      const target: XYPosition = this.getTarget()
      return `M${source.x},${source.y} L ${target.x} ${target.y}`
    },
    getClass(): string {
      switch (this.data.arcType) {
        case ArcType.TEST:
          return 'animated'
        default:
          return ''
      }
    },
    getMarkerEnd(): string {
      switch (this.data.arcType) {
        case ArcType.INHIBITORY:
          return 'circle'
        default:
          return 'arrow'
      }
    },
    getSourcePlacePosition(radius: number, targetHeight: number): XYPosition {
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
    getSourceTransitionPosition(
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
      if (this.flowType == FlowArcType.PLACE_TO_TRANSITION) {
        return this.getSourcePlacePosition(20, 40)
      } else {
        return this.getSourceTransitionPosition(40, 15, 40)
      }
    },
    getTargetPlacePosition(radius: number, sourceHeight: number): XYPosition {
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
    getTargetTransitionPosition(
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
      if (this.flowType == FlowArcType.PLACE_TO_TRANSITION) {
        return this.getTargetTransitionPosition(40, 40, 15)
      } else {
        return this.getTargetPlacePosition(20, 40)
      }
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
