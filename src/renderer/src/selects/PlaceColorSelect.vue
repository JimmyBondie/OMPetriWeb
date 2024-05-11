<script setup lang="ts">
import { Place } from '@renderer/entity/impl/Place'

defineProps<{
  place: Place
}>()
</script>

<template>
  <v-select
    :model-value="place.getColor()"
    :items="place.getColors()"
    item-title="id"
    item-value="description"
    prepend-icon="mdi-palette"
    variant="underlined"
    density="compact"
    :open-text="$t('Open')"
    :close-text="$t('Close')"
    :no-data-text="$t('NoDataAvailable')"
    disabled
  >
    <template v-slot:append>
      <v-btn>{{ $t('New') }}</v-btn>
    </template>
  </v-select>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
