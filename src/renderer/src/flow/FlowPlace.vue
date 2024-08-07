<script setup lang="ts">
import { PlaceType } from '@renderer/entity/impl/Place'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { Handle, NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-tooltip v-model="showTooltip" :text="data.id" location="top">
    <template v-slot:activator="{ props: tooltip }">
      <Handle></Handle>
      <v-card
        class="rounded-circle cursor-pointer"
        height="40"
        width="40"
        :color="selected ? 'green-lighten-3' : 'green-darken-2'"
        :border="calcBorder()"
        v-bind="tooltip"
        @mousedown="showTooltip = false"
        :ripple="false"
      >
        <v-card-title
          :style="'text-overflow: clip; ' + calcStyle()"
          class="pa-0 text-center text-caption"
        >
          {{ calcTitle() }}
        </v-card-title>
      </v-card>
    </template>
  </v-tooltip>
</template>

<script lang="ts">
export default {
  data() {
    return {
      place: this.data as DataPlace,
      showTooltip: false
    }
  },
  methods: {
    calcBorder(): string {
      switch (this.place.placeType) {
        case PlaceType.CONTINUOUS:
          return 'opacity-50 double lg'
        default:
          return 'none'
      }
    },
    calcStyle(): string {
      switch (this.place.placeType) {
        case PlaceType.CONTINUOUS:
          return 'line-height: 32px'
        case PlaceType.DISCRETE:
          return 'line-height: 40px'
      }
    },
    calcTitle(): string {
      switch (this.place.placeType) {
        case PlaceType.CONTINUOUS:
          return this.place.token.toFixed(2)
        default:
          return this.place.token.toFixed(0)
      }
    }
  }
}
</script>

<style lang="scss"></style>
