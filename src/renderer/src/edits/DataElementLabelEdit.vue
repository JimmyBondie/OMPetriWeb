<script setup lang="ts">
import { IDataElement } from '@renderer/data/intf/IDataElement'

defineProps<{
  dataElement: IDataElement
}>()
</script>

<template>
  <v-text-field
    :label="$t('Label')"
    v-model="dataElement.labelText"
    variant="underlined"
    prepend-icon="mdi-label-outline"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
