<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import QuickViewNode from './QuickViewNode.vue'
import TransitionTypeSelect from '@renderer/selects/TransitionTypeSelect.vue'
import TransitionFunctionEdit from '@renderer/edits/TransitionFunctionEdit.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'

defineProps<{
  dao: ModelDAO
  transition: DataTransition
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewNode :node="transition"></QuickViewNode>

  <v-divider class="mt-6 mb-5"></v-divider>

  <!-- Type -->
  <TransitionTypeSelect :transition="transition"></TransitionTypeSelect>

  <!-- Function -->
  <TransitionFunctionEdit :dao="dao" :transition="transition"></TransitionFunctionEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
