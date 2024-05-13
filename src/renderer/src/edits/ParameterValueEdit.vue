<script setup lang="ts">
import { Parameter } from '@renderer/core/Parameter'
import { CustomError } from '@renderer/utils/CustomError'
import { mapMutations } from 'vuex'

defineProps<{
  parameter: Parameter
}>()
</script>

<template>
  <v-text-field
    :label="$t('Value')"
    :model-value="parameter.value"
    :rules="[validateValue]"
    variant="underlined"
    prepend-icon="mdi-counter"
    type="number"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts">
class InputValidationException extends CustomError {}

export default {
  methods: {
    ...mapMutations(['updateParameter']),
    validateAndGetParameterValue(text: string): string {
      text = text.replaceAll(',', '.')
      if (text == '') {
        throw new InputValidationException(this.$t('CannotCreateParameterInvalidValue'))
      }
      return text
    },
    validateValue(text: string): boolean | string {
      try {
        const value: string = this.validateAndGetParameterValue(text)
        this.updateParameter({ parameter: this.parameter, value: value, unit: this.parameter.unit })
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
