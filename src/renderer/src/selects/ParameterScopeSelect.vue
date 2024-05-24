<script setup lang="ts">
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { mapGetters } from 'vuex'

defineProps<{
  dao: ModelDAO
  parameter: Parameter
}>()
</script>

<template>
  <v-select
    style="grid-template-columns: max-content minmax(0, 1fr) minmax(0, 1fr)"
    :items="ParameterType.values()"
    item-title="name"
    item-value="type"
    v-model="parameter.type"
    :label="$t('Type')"
    prepend-icon="mdi-alpha-t-box-outline"
    variant="underlined"
    density="compact"
    hide-details
  >
    <template v-slot:append>
      <v-select
        :label="$t('Element')"
        :items="getFilteredChoicesForLocalParameters(dao.model, '')"
        item-title="id"
        item-value="id"
        :model-value="parameter.relatedElement?.id"
        variant="underlined"
        density="compact"
        :disabled="parameter.type != ParameterType.LOCAL"
        hide-details
      ></v-select>
    </template>
  </v-select>
</template>

<script lang="ts">
export default {
  computed: {
    ...mapGetters(['getFilteredChoicesForLocalParameters'])
  }
}
</script>

<style lang="scss"></style>
