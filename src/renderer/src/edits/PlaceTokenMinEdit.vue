<script setup lang="ts">
import { Place } from '@renderer/entity/impl/Place'

defineProps<{
  place: Place
}>()
</script>

<template>
  <v-text-field
    :label="$t('TokenMin')"
    v-model="place.tokenMin"
    variant="underlined"
    prepend-icon="mdi-speedometer-slow"
    type="number"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
