<script setup lang="ts">
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { ArcType } from '@renderer/entity/intf/IArc'

defineProps<{
  data: IDataArc
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
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
    :d="`M${sourceX},${sourceY} L ${targetX} ${targetY}`"
  />
  <path
    class="vue-flow__edge-interaction"
    stroke-width="20"
    stroke-opacity="0"
    :d="`M${sourceX},${sourceY} L ${targetX} ${targetY}`"
  />
</template>

<script lang="ts">
export default {
  methods: {
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
