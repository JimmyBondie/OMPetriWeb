<script setup lang="ts">
import { DataPlace } from '@renderer/data/impl/DataPlace'
import QuickViewElement from './QuickViewElement.vue'
import PlaceTypeSelect from '@renderer/selects/PlaceTypeSelect.vue'
import PlaceColorSelect from '@renderer/selects/PlaceColorSelect.vue'
import NodeConstantEdit from '@renderer/edits/NodeConstantEdit.vue'
import PlaceTokenEdit from '@renderer/edits/PlaceTokenEdit.vue'
import PlaceTokenMinEdit from '@renderer/edits/PlaceTokenMinEdit.vue'
import PlaceTokenMaxEdit from '@renderer/edits/PlaceTokenMaxEdit.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

defineProps<{
  dao: ModelDAO
  place: DataPlace
  shape: IGraphElement
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewElement :dao="dao" :element="place" :shape="shape"></QuickViewElement>

  <v-divider class="mt-6 mb-5"></v-divider>

  <!-- Type -->
  <PlaceTypeSelect :dao="dao" :place="place"></PlaceTypeSelect>

  <!-- Color -->
  <PlaceColorSelect :place="place"></PlaceColorSelect>

  <!-- Constant -->
  <NodeConstantEdit :node="place"></NodeConstantEdit>

  <!-- Token -->
  <PlaceTokenEdit :place="place"></PlaceTokenEdit>

  <!-- Token min -->
  <PlaceTokenMinEdit :place="place"></PlaceTokenMinEdit>

  <!-- Token max -->
  <PlaceTokenMaxEdit :place="place"></PlaceTokenMaxEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
