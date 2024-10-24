<script setup lang="ts">
import { PlaceType } from '@renderer/entity/impl/Place'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { Handle, NodeProps } from '@vue-flow/core'
import { mapGetters } from 'vuex'
import { NodeNamesPosition } from '@renderer/store'

defineProps<NodeProps<IDataNode, any, string>>()
</script>

<template>
  <v-tooltip v-model="showTooltip" :disabled="getShowNodeNames" :text="data.id" location="top">
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
      place: this.data as DataPlace,
      showTooltip: false
    }
  },
  computed: {
    ...mapGetters(['getNodeNamesPosition', 'getShowNodeNames'])
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
          return 'transform: translate(45px, -30px);'

        case NodeNamesPosition.TOP:
          return 'transform: translateY(-65px);'

        default:
          return ''
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
