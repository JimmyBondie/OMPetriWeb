<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import TransitionFunctionEdit from '@renderer/edits/TransitionFunctionEdit.vue'
import { Transition } from '@renderer/entity/impl/Transition'

defineProps<{
  dao: ModelDAO
  transition: Transition
}>()
</script>

<template>
  <!-- Function visualization -->
  <vue-mathjax
    class="d-flex justify-center"
    :formula="'`' + transition.function.formatString() + '`'"
  />

  <!-- Function -->
  <TransitionFunctionEdit :dao="dao" :transition="transition"></TransitionFunctionEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
