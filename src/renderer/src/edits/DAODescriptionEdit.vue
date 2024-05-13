<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'

defineProps<{
  dao: ModelDAO
}>()
</script>

<template>
  <v-textarea
    :label="$t('Description')"
    v-model="dao.description"
    persistent-placeholder
    :placeholder="$t('EnterDescription')"
    variant="underlined"
    prepend-icon="mdi-text"
    density="compact"
  ></v-textarea>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
