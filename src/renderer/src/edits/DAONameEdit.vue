<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'

defineProps<{
  dao: ModelDAO
}>()
</script>

<template>
  <v-text-field
    :label="$t('Name')"
    v-model="dao.name"
    variant="underlined"
    prepend-icon="mdi-rename-outline"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
