<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { mapGetters } from 'vuex'
import ParameterNameEdit from '@renderer/edits/ParameterNameEdit.vue'
import ParameterValueEdit from '@renderer/edits/ParameterValueEdit.vue'
import ParameterUnitEdit from '@renderer/edits/ParameterUnitEdit.vue'
import ParameterScopeSelect from '@renderer/selects/ParameterScopeSelect.vue'

defineProps<{
  dao: ModelDAO
  dataElement: IDataElement
}>()
</script>

<template>
  <v-row class="pa-4">
    <v-col>
      <v-list height="250" rounded density="compact" v-model:selected="selectedParameters">
        <v-list-item
          style="grid-template-columns: 0 1fr minmax(100px, 2fr)"
          :subtitle="$t('Parameters')"
          density="compact"
        >
          <template v-slot:append>
            <v-text-field
              class="w-100"
              :placeholder="$t('FilterParameterNode')"
              :hint="$t('FilterParameterNode')"
              v-model="filter"
              variant="underlined"
              density="compact"
              hide-details
            ></v-text-field>
          </template>
        </v-list-item>

        <v-list-item
          v-for="parameter in getFilteredAndSortedParameterList(dao.model, dataElement, filter)"
          :value="parameter"
          density="compact"
          :title="parameter.id"
          :subtitle="parameter.value"
          :base-color="
            parameter.type == ParameterType.LOCAL && !parameter.relatedElement.equals(dataElement)
              ? 'grey'
              : undefined
          "
        ></v-list-item>
      </v-list>
    </v-col>

    <v-divider class="h-auto" vertical></v-divider>

    <v-col v-if="selectedParameters.length > 0">
      <!-- Name -->
      <ParameterNameEdit
        :dao="dao"
        :data-element="dataElement"
        :parameter="<Parameter>selectedParameters[0]"
      ></ParameterNameEdit>

      <!-- Value -->
      <ParameterValueEdit :parameter="<Parameter>selectedParameters[0]"></ParameterValueEdit>

      <!-- Unit -->
      <ParameterUnitEdit :parameter="<Parameter>selectedParameters[0]"></ParameterUnitEdit>

      <!-- Scope -->
      <ParameterScopeSelect
        :dao="dao"
        :parameter="<Parameter>selectedParameters[0]"
      ></ParameterScopeSelect>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {
      filter: '',
      selectedParameters: [] as Array<Parameter>
    }
  },
  computed: {
    ...mapGetters(['getFilteredAndSortedParameterList'])
  }
}
</script>

<style lang="scss"></style>
