<script setup lang="ts">
import { Function } from '@renderer/core/Function'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { Transition } from '@renderer/entity/impl/Transition'
import { mapGetters, mapMutations } from 'vuex'

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
    density="compact"
  ></v-textarea>
</template>

<script lang="ts">
export default {
  computed: {
    ...mapGetters(['validateAndGetFunction'])
  },
  methods: {
    ...mapMutations(['setElementFunction']),
    validateFunction(text: string): boolean | string {
      let input: string
      if (text == '') {
        input = '1'
      } else {
        input = text.replaceAll('\n', '')
      }

      try {
        const func: Function = this.validateAndGetFunction(this.dao.model, this.transition, input)
        this.setElementFunction({ model: this.dao.model, element: this.transition, func: func })
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
