<script setup lang="ts">
import { Color } from '@renderer/core/Color'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { Arc } from '@renderer/entity/impl/Arc'

defineProps<{
  arc: Arc
  color: Color | undefined
  dao: ModelDAO
}>()

defineEmits(['update:color'])
</script>

<template>
  <v-select
    :model-value="getColor()"
    @update:model-value="$emit('update:color', $event)"
    :items="dao.model.colors"
    item-title="id"
    item-value="description"
    prepend-icon="mdi-palette"
    density="compact"
    :open-text="$t('Open')"
    :close-text="$t('Close')"
    :no-data-text="$t('NoDataAvailable')"
    disabled
  >
    <template v-slot:append>
      <v-btn>{{ $t('New') }}</v-btn>
    </template>
  </v-select>
</template>

<script lang="ts">
export default {
  methods: {
    getColor(): Color | undefined {
      for (const color of this.dao.model.colors) {
        if (this.arc.getWeight(color)) {
          this.$emit('update:color', color)
          return color
        }
      }
      this.$emit('update:color', undefined)
      return undefined
    }
  }
}
</script>

<style lang="scss"></style>
