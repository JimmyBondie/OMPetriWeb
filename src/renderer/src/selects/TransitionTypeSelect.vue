<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { mapMutations } from 'vuex'

defineProps<{
  dao: ModelDAO
  transition: DataTransition
}>()
</script>

<template>
  <v-select
    :items="TransitionType.values()"
    item-title="name"
    item-value="type"
    :model-value="transition.transitionType"
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
    ...mapMutations(['changeTransitionType']),
    validateType(type: TransitionType): boolean | string {
      try {
        this.changeTransitionType({ dao: this.dao, transition: this.transition, type: type })
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
