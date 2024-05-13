<script setup lang="ts">
import { Parameter } from '@renderer/core/Parameter'
import { mapMutations } from 'vuex'

defineProps<{
  parameter: Parameter
}>()
</script>

<template>
  <v-text-field
    :label="$t('Unit')"
    :model-value="parameter.unit"
    :rules="[validateUnit]"
    variant="underlined"
    prepend-icon="mdi-weight-gram"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts">
export default {
  methods: {
    ...mapMutations(['updateParameter']),
    validateUnit(text: string): boolean | string {
      try {
        this.updateParameter({ parameter: this.parameter, value: this.parameter.value, unit: text })
      } catch (e: any) {
        if (e instanceof Error) {
          return e.message
        } else {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss"></style>
