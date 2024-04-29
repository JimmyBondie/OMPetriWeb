<script setup lang="ts">
import { PlaceType, Place } from '@renderer/entity/impl/Place'

defineProps<{
  place: Place
}>()
</script>

<template>
  <v-select
    :items="PlaceType.values()"
    item-title="name"
    item-value="type"
    v-model="place.placeType"
    :label="$t('Type')"
    prepend-icon="mdi-alpha-t-box-outline"
    density="compact"
  ></v-select>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
