<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataArc } from '@renderer/data/impl/DataArc'
import { ArcType } from '@renderer/entity/intf/IArc'
import { mapMutations } from 'vuex'

defineProps<{
  arc: DataArc
  dao: ModelDAO
}>()
</script>

<template>
  <v-select
    :items="ArcType.values()"
    item-title="name"
    item-value="type"
    :model-value="arc.arcType"
    :rules="[validateType]"
    :label="$t('Type')"
    prepend-icon="mdi-alpha-t-box-outline"
    variant="underlined"
    density="compact"
    :open-text="$t('Open')"
    :close-text="$t('Close')"
    :no-data-text="$t('NoDataAvailable')"
  ></v-select>
</template>

<script lang="ts">
export default {
  methods: {
    ...mapMutations(['changeArcType']),
    validateType(type: ArcType): boolean | string {
      try {
        this.changeArcType({ dao: this.dao, arc: this.arc, type: type })
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
