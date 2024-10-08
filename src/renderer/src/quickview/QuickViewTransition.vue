<script setup lang="ts">
import { DataTransition } from '@renderer/data/impl/DataTransition'
import QuickViewElement from './QuickViewElement.vue'
import TransitionTypeSelect from '@renderer/selects/TransitionTypeSelect.vue'
import TransitionFunctionEdit from '@renderer/edits/TransitionFunctionEdit.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import TransitionExpectedValueEdit from '@renderer/edits/TransitionExpectedValueEdit.vue'
import TransitionStandardDeviationValueEdit from '@renderer/edits/TransitionStandardDeviationValueEdit.vue'
import { DistributionType, TransitionType } from '@renderer/entity/impl/Transition'
import TransitionLowerLimitEdit from '@renderer/edits/TransitionLowerLimitEdit.vue'
import TransitionUpperLimitEdit from '@renderer/edits/TransitionUpperLimitEdit.vue'
import TransitionDistributionSelect from '@renderer/selects/TransitionDistributionSelect.vue'

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

  <!-- Distribution -->
  <TransitionDistributionSelect
    v-if="transition.transitionType == TransitionType.STOCHASTIC"
    :dao="dao"
    :transition="transition"
  ></TransitionDistributionSelect>

  <!-- Function -->
  <TransitionFunctionEdit
    v-if="
      transition.transitionType != TransitionType.STOCHASTIC ||
      transition.distribution == DistributionType.EXPONENTIAL
    "
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
