<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import QuickViewNode from './QuickViewNode.vue'
import SelectTransitionType from '@renderer/selects/SelectTransitionType.vue'
import EditFunction from '@renderer/edits/EditFunction.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'

defineProps<{
  dao: ModelDAO
  transition: DataTransition
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewNode :node="transition"></QuickViewNode>

  <v-divider class="mb-5"></v-divider>

  <!-- Type -->
  <SelectTransitionType :transition="transition"></SelectTransitionType>

  <!-- Function -->
  <EditFunction :dao="dao" :transition="transition"></EditFunction>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
