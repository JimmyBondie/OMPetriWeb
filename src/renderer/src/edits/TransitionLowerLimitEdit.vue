<script setup lang="ts">
import { Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  transition: Transition
}>()
</script>

<template>
  <v-number-input
    :label="$t('LowerLimit')"
    :rules="[validateNumber]"
    control-variant="stacked"
    :model-value="transition.lowerLimit"
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
      if (num <= this.transition.upperLimit) {
        this.transition.lowerLimit = num
        return true
      } else {
        return this.$t('LowerMustBeLowerThanUpper')
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
