<script setup lang="ts">
import { Color } from '@renderer/core/Color'
import { Function } from '@renderer/core/Function'
import { Weight } from '@renderer/core/Weight'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { Arc } from '@renderer/entity/impl/Arc'
import { mapGetters, mapMutations } from 'vuex'

defineProps<{
  arc: Arc
  color?: Color
  dao: ModelDAO
}>()
</script>

<template>
  <v-textarea
    :model-value="getFunction()"
    :label="$t('Function')"
    :placeholder="$t('EnterFunction')"
    :rules="[validateFunction]"
    persistent-placeholder
    prepend-icon="mdi-function"
    variant="underlined"
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
    getFunction(): string {
      if (!this.color) {
        return ''
      }

      const weight: Weight | undefined = this.arc.getWeight(this.color)
      if (!weight) {
        return ''
      }

      return weight.function.formatString()
    },
    validateFunction(text: string): boolean | string {
      let input: string
      if (text == '') {
        input = '1'
      } else {
        input = text.replaceAll('\n', '')
      }

      try {
        const func: Function = this.validateAndGetFunction(this.dao.model, this.arc, input)
        this.setElementFunction({
          model: this.dao.model,
          element: this.arc,
          func: func,
          color: this.color
        })
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
