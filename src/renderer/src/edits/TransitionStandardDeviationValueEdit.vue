<script setup lang="ts">
import { Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  transition: Transition
}>()
</script>

<template>
  <v-number-input
    :label="$t('StandardDeviation')"
    :rules="[validateNumber]"
    control-variant="stacked"
    :model-value="transition.standardDeviation"
    variant="underlined"
    density="compact"
    inputmode="decimal"
  >
    <template v-slot:prepend>
      <v-icon>mdi-dots-grid</v-icon>
    </template>
  </v-number-input>
</template>

<script lang="ts">
export default {
  methods: {
    validateNumber(text: string): boolean | string {
      const num: number = parseFloat(text)
      if (num >= 0) {
        this.transition.standardDeviation = num
        return true
      } else {
        return this.$t('StandardDeviationMustNotBeNegative')
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
