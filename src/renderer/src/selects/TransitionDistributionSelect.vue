<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DistributionType, Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  dao: ModelDAO
  transition: Transition
}>()
</script>

<template>
  <v-select
    :items="DistributionType.values()"
    item-title="name"
    item-value="type"
    v-model="transition.distribution"
    :label="$t('Distribution')"
    prepend-icon="mdi-alpha-d-box-outline"
    variant="underlined"
    density="compact"
  ></v-select>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
