<script setup lang="ts">
import { DataType } from '@renderer/data/intf/DataType'
import { IDataNode } from '@renderer/data/intf/IDataNode'

defineProps<{
  node: IDataNode
}>()
</script>

<template>
  <!-- Type -->
  <v-text-field
    :label="$t('Type')"
    :model-value="DataType.toString(node.type)"
    variant="underlined"
    prepend-icon="mdi-alpha-t-box-outline"
    density="compact"
    disabled
  ></v-text-field>

  <!-- Name -->
  <v-text-field
    :label="$t('Name')"
    v-model="node.id"
    variant="underlined"
    prepend-icon="mdi-rename-outline"
    density="compact"
  ></v-text-field>

  <!-- Label -->
  <v-text-field
    :label="$t('Label')"
    v-model="node.labelText"
    variant="underlined"
    prepend-icon="mdi-label-outline"
    density="compact"
  ></v-text-field>

  <!-- Disabled -->
  <v-switch
    :label="node.disabled ? $t('Disabled') : $t('Enabled')"
    v-model="node.disabled"
    prepend-icon="mdi-cancel"
    density="compact"
  ></v-switch>

  <!-- Description -->
  <v-textarea
    :label="$t('Description')"
    v-model="node.description"
    persistent-placeholder
    :placeholder="$t('EnterDescription')"
    variant="underlined"
    prepend-icon="mdi-text"
    density="compact"
  ></v-textarea>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
