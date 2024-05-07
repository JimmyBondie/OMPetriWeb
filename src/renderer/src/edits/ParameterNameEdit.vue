<script setup lang="ts">
import { Parameter } from '@renderer/core/Parameter'

defineProps<{
  parameter: Parameter
}>()
</script>

<template>
  <v-text-field
    :label="$t('Name')"
    v-model="parameter.id"
    variant="underlined"
    prepend-icon="mdi-rename-outline"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
