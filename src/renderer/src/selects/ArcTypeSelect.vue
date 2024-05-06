<script setup lang="ts">
import { Arc } from '@renderer/entity/impl/Arc'
import { ArcType } from '@renderer/entity/intf/IArc'

defineProps<{
  arc: Arc
}>()
</script>

<template>
  <v-select
    :items="ArcType.values()"
    item-title="name"
    item-value="type"
    v-model="arc.arcType"
    :label="$t('Type')"
    prepend-icon="mdi-alpha-t-box-outline"
    density="compact"
    :open-text="$t('Open')"
    :close-text="$t('Close')"
  ></v-select>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
