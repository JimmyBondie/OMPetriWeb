<script setup lang="ts">
import { TransitionType, Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  transition: Transition
}>()
</script>

<template>
  <v-select
    :items="TransitionType.values()"
    item-title="name"
    item-value="type"
    v-model="transition.transitionType"
    :label="$t('Type')"
    prepend-icon="mdi-alpha-t-box-outline"
    variant="underlined"
    density="compact"
    :open-text="$t('Open')"
    :close-text="$t('Close')"
    :no-data-text="$t('NoDataAvailable')"
  ></v-select>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
