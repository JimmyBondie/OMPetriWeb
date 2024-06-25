<script setup lang="ts">
import { DataCluster } from '@renderer/data/impl/DataCluster'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { GraphNode, Handle, NodeProps, VueFlowStore, useVueFlow } from '@vue-flow/core'

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
        :border="selected ? 'opacity-50 thin' : undefined"
        :color="dragOver ? 'green' : undefined"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
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
      dragOver: false as boolean,
      flowInstance: useVueFlow() as VueFlowStore,
      showTooltip: false
    }
  },
  methods: {
    onDragEnter() {
      if (!this.flowInstance) {
        return
      }

      const node: GraphNode | undefined = this.flowInstance.findNode(this.id)
      if (node) {
        this.dragOver = true
        this.flowInstance.addSelectedNodes([node])
      }
    },
    onDragLeave() {
      if (!this.flowInstance) {
        return
      }

      const node: GraphNode | undefined = this.flowInstance.findNode(this.id)
      if (node) {
        this.dragOver = false
        this.flowInstance.removeSelectedNodes([node])
      }
    }
  }
}
</script>

<style lang="scss"></style>
