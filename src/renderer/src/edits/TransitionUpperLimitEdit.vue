<script setup lang="ts">
import { Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  transition: Transition
}>()
</script>

<template>
  <v-number-input
    :label="$t('UpperLimit')"
    :rules="[validateNumber]"
    control-variant="stacked"
    :model-value="transition.upperLimit"
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
      if (num >= this.transition.lowerLimit) {
        this.transition.upperLimit = num
        return true
      } else {
        return this.$t('UpperMustBeGreaterThanLower')
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
