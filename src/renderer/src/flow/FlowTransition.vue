<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { NodeNamesPosition } from '@renderer/store'
import { Handle, NodeProps } from '@vue-flow/core'
import { mapGetters } from 'vuex'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-tooltip v-model="showTooltip" :disabled="getShowNodeNames" :text="data.id" location="top">
    <template v-slot:activator="{ props: tooltip }">
      <Handle :style="getShowNodeNames ? 'transform: translate(-15.5px, -3px)' : ''"></Handle>
      <v-card
        class="pa-1 cursor-pointer"
        :color="selected ? 'blue-lighten-3' : calcColor()"
        width="15"
        height="40"
        :border="calcBorder()"
        v-bind="tooltip"
        @mousedown="showTooltip = false"
        :ripple="false"
      ></v-card>
      <p
        v-if="getShowNodeNames"
        class="text-caption text-truncate"
        :class="calcNameClass()"
        style="width: 40px"
        :style="calcNamePosition()"
      >
        {{ data.id }}
      </p>
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
  computed: {
    ...mapGetters(['getNodeNamesPosition', 'getShowNodeNames'])
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
    },
    calcNameClass(): string {
      switch (this.getNodeNamesPosition) {
        case NodeNamesPosition.LEFT:
          return 'text-right'

        case NodeNamesPosition.RIGHT:
          return 'text-left'

        default:
          return 'text-center'
      }
    },
    calcNamePosition(): string {
      switch (this.getNodeNamesPosition) {
        case NodeNamesPosition.LEFT:
          return 'transform: translate(-45px, -30px);'

        case NodeNamesPosition.RIGHT:
          return 'transform: translate(20px, -30px);'

        case NodeNamesPosition.TOP:
          return 'transform: translate(-12.5px, -65px);'

        default:
          return 'transform: translateX(-12.5px)'
      }
    }
  }
}
</script>

<style lang="scss"></style>
