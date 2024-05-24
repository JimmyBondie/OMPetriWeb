<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { PlaceType } from '@renderer/entity/impl/Place'
import { mapMutations } from 'vuex'

defineProps<{
  dao: ModelDAO
  place: DataPlace
}>()
</script>

<template>
  <v-select
    :items="PlaceType.values()"
    item-title="name"
    item-value="type"
    :model-value="place.placeType"
    :rules="[validateType]"
    :label="$t('Type')"
    prepend-icon="mdi-alpha-t-box-outline"
    variant="underlined"
    density="compact"
  ></v-select>
</template>

<script lang="ts">
export default {
  methods: {
    ...mapMutations(['changePlaceType']),
    validateType(type: PlaceType): boolean | string {
      try {
        this.changePlaceType({ dao: this.dao, place: this.place, type: type })
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
