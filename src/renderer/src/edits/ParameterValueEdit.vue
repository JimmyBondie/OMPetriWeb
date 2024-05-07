<script setup lang="ts">
import { Parameter } from '@renderer/core/Parameter'

defineProps<{
  parameter: Parameter
}>()
</script>

<template>
  <v-text-field
    :label="$t('Value')"
    v-model="parameter.value"
    variant="underlined"
    prepend-icon="mdi-counter"
    type="number"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
