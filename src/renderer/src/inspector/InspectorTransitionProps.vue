<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import TransitionExpectedValueEdit from '@renderer/edits/TransitionExpectedValueEdit.vue'
import TransitionFunctionEdit from '@renderer/edits/TransitionFunctionEdit.vue'
import TransitionLowerLimitEdit from '@renderer/edits/TransitionLowerLimitEdit.vue'
import TransitionStandardDeviationValueEdit from '@renderer/edits/TransitionStandardDeviationValueEdit.vue'
import TransitionUpperLimitEdit from '@renderer/edits/TransitionUpperLimitEdit.vue'
import { DistributionType, Transition, TransitionType } from '@renderer/entity/impl/Transition'
import TransitionDistributionSelect from '@renderer/selects/TransitionDistributionSelect.vue'

defineProps<{
  dao: ModelDAO
  transition: Transition
}>()
</script>

<template>
  <!-- Distribution -->
  <TransitionDistributionSelect
    v-if="transition.transitionType == TransitionType.STOCHASTIC"
    :dao="dao"
    :transition="transition"
  ></TransitionDistributionSelect>

  <!-- Function visualization -->
  <vue-mathjax
    v-if="
      transition.transitionType != TransitionType.STOCHASTIC ||
      transition.distribution == DistributionType.EXPONENTIAL
    "
    class="d-flex justify-center"
    :formula="'`' + transition.function.formatString(true) + '`'"
  />

  <!-- Function -->
  <TransitionFunctionEdit
    v-if="
      transition.transitionType != TransitionType.STOCHASTIC ||
      transition.distribution == DistributionType.EXPONENTIAL
    "
    class="mt-4"
    :dao="dao"
    :transition="transition"
  ></TransitionFunctionEdit>

  <!-- Expected value -->
  <TransitionExpectedValueEdit
    v-if="
      transition.transitionType == TransitionType.STOCHASTIC &&
      transition.distribution == DistributionType.NORMAL
    "
    :transition="transition"
  ></TransitionExpectedValueEdit>

  <!-- Standard deviation -->
  <TransitionStandardDeviationValueEdit
    v-if="
      transition.transitionType == TransitionType.STOCHASTIC &&
      transition.distribution == DistributionType.NORMAL
    "
    :transition="transition"
  ></TransitionStandardDeviationValueEdit>

  <!-- Lower limit -->
  <TransitionLowerLimitEdit
    v-if="
      transition.transitionType == TransitionType.STOCHASTIC &&
      transition.distribution == DistributionType.UNIFORM
    "
    :transition="transition"
  ></TransitionLowerLimitEdit>

  <!-- Upper limit -->
  <TransitionUpperLimitEdit
    v-if="
      transition.transitionType == TransitionType.STOCHASTIC &&
      transition.distribution == DistributionType.UNIFORM
    "
    :transition="transition"
  ></TransitionUpperLimitEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
