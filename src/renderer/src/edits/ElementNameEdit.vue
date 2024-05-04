<script setup lang="ts">
import { IElement } from '@renderer/entity/intf/IElement'

defineProps<{
  element: IElement
}>()
</script>

<template>
  <v-text-field
    :label="$t('Name')"
    v-model="element.id"
    variant="underlined"
    prepend-icon="mdi-rename-outline"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
