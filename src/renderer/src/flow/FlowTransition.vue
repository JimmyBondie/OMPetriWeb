<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { Handle, NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-tooltip v-model="showTooltip" :text="data.id" location="top">
    <template v-slot:activator="{ props: tooltip }">
      <Handle></Handle>
      <v-card
        class="pa-1 cursor-pointer"
        :color="calcColor()"
        width="15"
        height="40"
        :border="calcBorder()"
        v-bind="tooltip"
        @mousedown="showTooltip = false"
        :ripple="false"
      ></v-card>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  data() {
    return {
      showTooltip: false,
      transition: this.data as DataTransition
    }
  },
  methods: {
    calcBorder(): string {
      switch (this.transition.transitionType) {
        case TransitionType.CONTINUOUS:
          return 'opacity-50 double lg'
        default:
          return 'none'
      }
    },
    calcColor(): string {
      switch (this.transition.transitionType) {
        case TransitionType.STOCHASTIC:
          return 'blue-darken-4'
        default:
          return 'blue-darken-2'
      }
    }
  }
}
</script>

<style lang="scss"></style>
