<script setup lang="ts">
import { Place } from '@renderer/entity/impl/Place'

defineProps<{
  place: Place
}>()
</script>

<template>
  <v-number-input
    :label="$t('TokenMin')"
    control-variant="stacked"
    v-model="place.tokenMin"
    variant="underlined"
    density="compact"
  >
    <template v-slot:prepend>
      <v-icon>mdi-speedometer-slow</v-icon>
    </template>
  </v-number-input>
</template>

<script lang="ts"></script>

<style lang="scss">
.v-field.v-field--variant-underlined .v-field__append-inner {
  padding: 0;
}
</style>
