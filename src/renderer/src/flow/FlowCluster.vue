<script setup lang="ts">
import { DataCluster } from '@renderer/data/impl/DataCluster'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { Handle, NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-tooltip v-model="showTooltip" :text="data.id" location="top">
    <template v-slot:activator="{ props: tooltip }">
      <Handle class="opacity-0"></Handle>
      <v-card
        class="h-100 w-100 cursor-pointer"
        v-bind="tooltip"
        @mousedown="showTooltip = false"
        :ripple="false"
        variant="tonal"
      >
        <v-card-title class="text-center">
          {{ cluster.labelText }}
        </v-card-title>
      </v-card>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  data() {
    return {
      cluster: this.data as DataCluster,
      showTooltip: false
    }
  }
}
</script>

<style lang="scss"></style>
