<script setup lang="ts">
import { Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  transition: Transition
}>()
</script>

<template>
  <v-number-input
    :label="$t('ExpectedValue')"
    control-variant="stacked"
    v-model="transition.expectedValue"
    variant="underlined"
    density="compact"
    inputmode="decimal"
  >
    <template v-slot:prepend>
      <v-icon>mdi-dots-grid</v-icon>
    </template>
  </v-number-input>
</template>

<script lang="ts"></script>

<style lang="scss">
.v-field.v-field--variant-underlined .v-field__append-inner {
  padding: 0 !important;
}
</style>
