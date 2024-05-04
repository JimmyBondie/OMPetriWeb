<script setup lang="ts">
import { DataPlace } from '@renderer/data/impl/DataPlace'
import QuickViewNode from './QuickViewNode.vue'
import PlaceTypeSelect from '@renderer/selects/PlaceTypeSelect.vue'
import PlaceColorSelect from '@renderer/selects/PlaceColorSelect.vue'
import NodeConstantEdit from '@renderer/edits/NodeConstantEdit.vue'
import PlaceTokenEdit from '@renderer/edits/PlaceTokenEdit.vue'
import PlaceTokenMinEdit from '@renderer/edits/PlaceTokenMinEdit.vue'
import PlaceTokenMaxEdit from '@renderer/edits/PlaceTokenMaxEdit.vue'

defineProps<{
  place: DataPlace
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewNode :node="place"></QuickViewNode>

  <v-divider class="mb-5"></v-divider>

  <!-- Type -->
  <PlaceTypeSelect :place="place"></PlaceTypeSelect>

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
