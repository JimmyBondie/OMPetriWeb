<script setup lang="ts">
import { IDataElement } from '@renderer/data/intf/IDataElement'
import DataElementDescriptionEdit from '@renderer/edits/DataElementDescriptionEdit.vue'
import DataElementLabelEdit from '@renderer/edits/DataElementLabelEdit.vue'
import DataElementTypeEdit from '@renderer/edits/DataElementTypeEdit.vue'
import ElementDisabledEdit from '@renderer/edits/ElementDisabledEdit.vue'
import ElementNameEdit from '@renderer/edits/ElementNameEdit.vue'

defineProps<{
  element: IDataElement
}>()
</script>

<template>
  <!-- Type -->
  <DataElementTypeEdit :data-element="element"></DataElementTypeEdit>

  <!-- Name -->
  <ElementNameEdit :element="element"></ElementNameEdit>

  <!-- Label -->
  <DataElementLabelEdit :data-element="element"></DataElementLabelEdit>

  <!-- Disabled -->
  <ElementDisabledEdit :element="element"></ElementDisabledEdit>

  <!-- Description -->
  <DataElementDescriptionEdit :data-element="element"></DataElementDescriptionEdit>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
