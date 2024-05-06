<script setup lang="ts">
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-sheet class="pa-1 ma-2 rounded-circle" color="success">
    {{ (data as DataPlace).token.toFixed(2) }}
  </v-sheet>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
