<script setup lang="ts">
import { IDataNode } from '@renderer/data/intf/IDataNode'
import DataElementDescriptionEdit from '@renderer/edits/DataElementDescriptionEdit.vue'
import DataElementLabelEdit from '@renderer/edits/DataElementLabelEdit.vue'
import DataElementTypeEdit from '@renderer/edits/DataElementTypeEdit.vue'
import ElementDisabledEdit from '@renderer/edits/ElementDisabledEdit.vue'
import ElementNameEdit from '@renderer/edits/ElementNameEdit.vue'

defineProps<{
  node: IDataNode
}>()
</script>

<template>
  <!-- Type -->
  <DataElementTypeEdit :data-element="node"></DataElementTypeEdit>

  <!-- Name -->
  <ElementNameEdit :element="node"></ElementNameEdit>

  <!-- Label -->
  <DataElementLabelEdit :data-element="node"></DataElementLabelEdit>

  <!-- Disabled -->
  <ElementDisabledEdit :element="node"></ElementDisabledEdit>

  <!-- Description -->
  <DataElementDescriptionEdit :data-element="node"></DataElementDescriptionEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
