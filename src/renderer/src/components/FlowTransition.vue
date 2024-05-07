<script setup lang="ts">
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-sheet class="pa-1" color="info" width="15" height="40"></v-sheet>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
