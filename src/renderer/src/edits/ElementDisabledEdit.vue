<script setup lang="ts">
import { IElement } from '@renderer/entity/intf/IElement'

defineProps<{
  element: IElement
}>()
</script>

<template>
  <v-switch
    :label="element.disabled ? $t('Disabled') : $t('Enabled')"
    v-model="element.disabled"
    prepend-icon="mdi-cancel"
    density="compact"
    :false-value="true"
    :true-value="false"
  ></v-switch>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
