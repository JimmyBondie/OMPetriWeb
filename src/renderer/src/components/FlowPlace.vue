<script setup lang="ts">
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-sheet
    style="line-height: 33px"
    class="pa-1 rounded-circle"
    height="40"
    width="40"
    color="success"
  >
    {{ (data as DataPlace).token.toFixed(2) }}
  </v-sheet>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
