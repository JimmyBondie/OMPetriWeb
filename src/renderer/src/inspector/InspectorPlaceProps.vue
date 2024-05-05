<script setup lang="ts">
import NodeConstantEdit from '@renderer/edits/NodeConstantEdit.vue'
import PlaceTokenEdit from '@renderer/edits/PlaceTokenEdit.vue'
import PlaceTokenMaxEdit from '@renderer/edits/PlaceTokenMaxEdit.vue'
import PlaceTokenMinEdit from '@renderer/edits/PlaceTokenMinEdit.vue'
import { Place } from '@renderer/entity/impl/Place'
import PlaceColorSelect from '@renderer/selects/PlaceColorSelect.vue'

defineProps<{
  place: Place
}>()
</script>

<template>
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
