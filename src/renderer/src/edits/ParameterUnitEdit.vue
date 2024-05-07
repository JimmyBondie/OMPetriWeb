<script setup lang="ts">
import { Parameter } from '@renderer/core/Parameter'

defineProps<{
  parameter: Parameter
}>()
</script>

<template>
  <v-text-field
    :label="$t('Unit')"
    v-model="parameter.unit"
    variant="underlined"
    prepend-icon="mdi-weight-gram"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
