<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-card class="pa-1" :color="calcColor()" width="15" height="40" :border="calcBorder()"></v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
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
