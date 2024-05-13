<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IElement } from '@renderer/entity/intf/IElement'
import { mapMutations } from 'vuex'

defineProps<{
  dao: ModelDAO
  element: IElement
}>()
</script>

<template>
  <v-text-field
    class="mb-2"
    :label="$t('Name')"
    :model-value="element.id"
    :rules="[validateId]"
    variant="underlined"
    prepend-icon="mdi-rename-outline"
    density="compact"
    max-errors="2"
  ></v-text-field>
</template>

<script lang="ts">
export default {
  methods: {
    ...mapMutations(['changeElementId']),
    validateId(text: string): boolean | string {
      try {
        this.changeElementId({ dao: this.dao, element: this.element, elementIdNew: text })
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
