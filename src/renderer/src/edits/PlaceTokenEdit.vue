<script setup lang="ts">
import { Place, PlaceType } from '@renderer/entity/impl/Place'

defineProps<{
  place: Place
}>()
</script>

<template>
  <v-number-input
    :label="$t('Token')"
    :rules="[validateNumber]"
    control-variant="stacked"
    :model-value="place.token"
    variant="underlined"
    density="compact"
    :inputmode="calcInputMode()"
  >
    <template v-slot:prepend>
      <v-icon>mdi-dots-grid</v-icon>
    </template>
  </v-number-input>
</template>

<script lang="ts">
export default {
  methods: {
    calcInputMode(): string {
      switch (this.place.placeType) {
        case PlaceType.DISCRETE:
          return 'numeric'
        case PlaceType.CONTINUOUS:
          return 'decimal'
      }
    },
    validateNumber(text: string): boolean | string {
      const num: number = parseFloat(text)
      if (this.place.placeType == PlaceType.CONTINUOUS) {
        this.place.token = num
        return true
      } else {
        if (Number.isInteger(num)) {
          this.place.token = num
          return true
        } else {
          return this.$t('OnlyDiscreteValuesPermitted')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.v-field.v-field--variant-underlined .v-field__append-inner {
  padding: 0 !important;
}
</style>
