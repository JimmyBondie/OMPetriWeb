<script setup lang="ts">
import { Function } from '@renderer/core/Function'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { Transition } from '@renderer/entity/impl/Transition'
import { services } from '@renderer/services'

defineProps<{
  dao: ModelDAO
  transition: Transition
}>()
</script>

<template>
  <v-textarea
    :model-value="transition.function.formatString()"
    :label="$t('Function')"
    :placeholder="$t('EnterFunction')"
    :rules="[validateFunction]"
    persistent-placeholder
    prepend-icon="mdi-function"
  ></v-textarea>
</template>

<script lang="ts">
export default {
  methods: {
    validateFunction(text: string): boolean | string {
      let input: string
      if (text == '') {
        input = '1'
      } else {
        input = text.replaceAll('\n', '')
      }

      try {
        const func: Function = services.parameterService.validateAndGetFunction(
          this.dao.model,
          this.transition,
          input
        )
        services.modelService.setElementFunction(this.dao, this.transition, func)
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
