<script setup lang="ts">
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { EdgeProps } from '@vue-flow/core'

defineProps<EdgeProps<IGraphArc, any, string>>()
</script>

<template>
  <g>
    <path
      class="vue-flow__connection animated"
      fill="none"
      stroke="#6F3381"
      :stroke-width="2.5"
      :d="`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`"
    />

    <circle :cx="targetX" :cy="targetY" fill="#fff" :r="4" stroke="#6F3381" :stroke-width="1.5" />
  </g>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
