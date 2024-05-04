<script setup lang="ts">
import { INode } from '@renderer/entity/intf/INode'

defineProps<{
  node: INode
}>()
</script>

<template>
  <v-checkbox
    :label="$t('Constant')"
    v-model="node.constant"
    prepend-icon="mdi-equal"
    density="compact"
  >
  </v-checkbox>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
