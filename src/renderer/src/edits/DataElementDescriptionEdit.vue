<script setup lang="ts">
import { IDataElement } from '@renderer/data/intf/IDataElement'

defineProps<{
  dataElement: IDataElement
}>()
</script>

<template>
  <v-textarea
    :label="$t('Description')"
    v-model="dataElement.description"
    persistent-placeholder
    :placeholder="$t('EnterDescription')"
    variant="underlined"
    prepend-icon="mdi-text"
    density="compact"
  ></v-textarea>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
