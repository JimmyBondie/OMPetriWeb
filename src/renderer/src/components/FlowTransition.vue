<script setup lang="ts">
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IGraphNode, any, string>>()
</script>

<template>
  <v-sheet color="info">{{ data.id }}</v-sheet>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
