<script setup lang="ts">
import QuickViewElement from './QuickViewElement.vue'
import ArcTypeSelect from '@renderer/selects/ArcTypeSelect.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataArc } from '@renderer/data/impl/DataArc'
import ArcColorSelect from '@renderer/selects/ArcColorSelect.vue'
import ArcFunctionEdit from '@renderer/edits/ArcFunctionEdit.vue'
import { Color } from '@renderer/core/Color'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

defineProps<{
  dao: ModelDAO
  arc: DataArc
  shape: IGraphElement
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewElement :dao="dao" :element="arc" :shape="shape"></QuickViewElement>

  <v-divider class="mt-6 mb-5"></v-divider>

  <!-- Type -->
  <ArcTypeSelect :arc="arc" :dao="dao"></ArcTypeSelect>

  <!-- Color -->
  <ArcColorSelect :arc="arc" v-model:color="<Color | undefined>color" :dao="dao"></ArcColorSelect>

  <!-- Function -->
  <ArcFunctionEdit :arc="arc" :color="<Color | undefined>color" :dao="dao"></ArcFunctionEdit>
</template>

<script lang="ts">
export default {
  data() {
    return {
      color: undefined as Color | undefined
    }
  }
}
</script>

<style lang="scss"></style>
