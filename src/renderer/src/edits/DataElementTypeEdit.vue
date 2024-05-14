<script setup lang="ts">
import { DataType } from '@renderer/data/intf/DataType'
import { IDataElement } from '@renderer/data/intf/IDataElement'

defineProps<{
  dataElement: IDataElement
}>()
</script>

<template>
  <v-text-field
    :label="$t('Type')"
    :model-value="DataType.toText(dataElement.type)"
    variant="underlined"
    prepend-icon="mdi-alpha-t-box-outline"
    density="compact"
    disabled
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
