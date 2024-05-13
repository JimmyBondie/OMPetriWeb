<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'

defineProps<{
  dao: ModelDAO
}>()
</script>

<template>
  <v-text-field
    :label="$t('Author')"
    v-model="dao.author"
    variant="underlined"
    prepend-icon="mdi-account-outline"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
