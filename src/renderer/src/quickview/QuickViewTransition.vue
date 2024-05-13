<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import QuickViewElement from './QuickViewElement.vue'
import TransitionTypeSelect from '@renderer/selects/TransitionTypeSelect.vue'
import TransitionFunctionEdit from '@renderer/edits/TransitionFunctionEdit.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

defineProps<{
  dao: ModelDAO
  transition: DataTransition
  shape: IGraphElement
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewElement :dao="dao" :element="transition" :shape="shape"></QuickViewElement>

  <v-divider class="mt-6 mb-5"></v-divider>

  <!-- Type -->
  <TransitionTypeSelect :dao="dao" :transition="transition"></TransitionTypeSelect>

  <!-- Function -->
  <TransitionFunctionEdit :dao="dao" :transition="transition"></TransitionFunctionEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
