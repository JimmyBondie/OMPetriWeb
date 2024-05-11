<script setup lang="ts">
import { PlaceType } from '@renderer/entity/impl/Place'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { NodeProps } from '@vue-flow/core'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-card
    class="rounded-circle"
    height="40"
    width="40"
    color="green-darken-2"
    :border="calcBorder()"
  >
    <v-card-title
      :style="'text-overflow: clip; ' + calcStyle()"
      class="pa-0 text-center text-caption"
    >
      {{ place.token.toFixed(2) }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      place: this.data as DataPlace
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
    }
  }
}
</script>

<style lang="scss"></style>
