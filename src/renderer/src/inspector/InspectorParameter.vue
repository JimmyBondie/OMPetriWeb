<script setup lang="ts">
import { Parameter } from '@renderer/core/Parameter'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import ParameterNameEdit from '@renderer/edits/ParameterNameEdit.vue'
import ParameterUnitEdit from '@renderer/edits/ParameterUnitEdit.vue'
import ParameterValueEdit from '@renderer/edits/ParameterValueEdit.vue'
import ParameterScopeSelect from '@renderer/selects/ParameterScopeSelect.vue'

defineProps<{
  dao: ModelDAO
  dataElement: IDataElement
  parameter: Parameter
}>()
</script>

<template>
  <!-- Name -->
  <ParameterNameEdit
    :dao="dao"
    :data-element="dataElement"
    v-on:new-id="(value: string) => $emit('newId', value)"
    :parameter="parameter"
  ></ParameterNameEdit>

  <!-- Value -->
  <ParameterValueEdit :parameter="parameter"></ParameterValueEdit>

  <!-- Unit -->
  <ParameterUnitEdit :parameter="parameter"></ParameterUnitEdit>

  <!-- Scope -->
  <ParameterScopeSelect :dao="dao" :parameter="parameter"></ParameterScopeSelect>
</template>

<script lang="ts">
export default {
  emits: ['newId']
}
</script>

<style lang="scss"></style>
