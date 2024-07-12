<script setup lang="ts">
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { utils } from '@renderer/utils'
import { CustomError } from '@renderer/utils/CustomError'
import { mapGetters, mapMutations } from 'vuex'

defineProps<{
  dao: ModelDAO
  dataElement: IDataElement
  parameter: Parameter
}>()
</script>

<template>
  <v-text-field
    :label="$t('Name')"
    :model-value="parameter.id"
    :rules="[validateName]"
    variant="underlined"
    prepend-icon="mdi-rename-outline"
    density="compact"
  ></v-text-field>
</template>

<script lang="ts">
class InputValidationException extends CustomError {}

export default {
  emits: ['newId'],
  methods: {
    ...mapGetters(['findParameter']),
    ...mapMutations(['updateParameter']),
    isNameInputValid(text: string): boolean {
      const param: Parameter | undefined = this.findParameter()(
        this.dao.model,
        text,
        this.dataElement
      )

      if (param) {
        // parameter with given id either exists globally / locally or is a reference

        switch (param.type) {
          case ParameterType.GLOBAL: {
            return true
          }

          case ParameterType.LOCAL: {
            return true
          }

          default: {
            // reference
            return false
          }
        }
      } else {
        // Validate ID format
        if (text == '' || !text.match(utils.functionFactory.parameterRegex)) {
          return false
        }

        const restrictedRegex: Array<string> = ['T[0-9]+', 'P[0-9]+']

        for (const regex of restrictedRegex) {
          if (text.match(regex)) {
            return false
          }
        }
      }

      return true
    },
    updateNewId(newId: string) {
      this.$emit('newId', newId)
    },
    validateAndGetParameterId(text: string): string {
      if (!this.isNameInputValid(text)) {
        throw new InputValidationException(this.$t('CannotCreateParameterInvalidName'))
      }
      return text
    },
    validateName(text: string): boolean | string {
      try {
        const id: string = this.validateAndGetParameterId(text)
        const param: Parameter | undefined = this.findParameter()(
          this.dao.model,
          id,
          this.dataElement
        )
        if (param) {
          this.updateParameter({ parameter: param, value: param.value, unit: param.unit })
        } else {
          this.updateNewId(id)
        }
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
