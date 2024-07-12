<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import ParameterNameEdit from '@renderer/edits/ParameterNameEdit.vue'
import ParameterValueEdit from '@renderer/edits/ParameterValueEdit.vue'
import ParameterUnitEdit from '@renderer/edits/ParameterUnitEdit.vue'
import ParameterScopeSelect from '@renderer/selects/ParameterScopeSelect.vue'
import { mapGetters, mapMutations } from 'vuex'

defineProps<{
  dao: ModelDAO
  dataElement: IDataElement
}>()
</script>

<template>
  <v-dialog v-if="parameterToDelete" max-width="500" v-model="askDelete">
    <v-card>
      <v-card-text>{{ $t('WantToDeleteParameter', { id: parameterToDelete.id }) }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="
            () => {
              askDelete = false
              removeParameter({ dao: dao, parameter: parameterToDelete })
            }
          "
          >{{ $t('Yes') }}</v-btn
        >
        <v-btn @click="askDelete = false">{{ $t('No') }}</v-btn>
        <v-btn @click="askDelete = false">{{ $t('Cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
        >
          <template v-slot:append>
            <v-tooltip :text="$t('Delete')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  color="error"
                  icon="mdi-trash-can"
                  @click.stop="
                    () => {
                      parameterToDelete = parameter
                      askDelete = true
                    }
                  "
                ></v-btn>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
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
      askDelete: false as boolean,
      parameterToDelete: null as Parameter | null,
      filter: '',
      selectedParameters: [] as Array<Parameter>
    }
  },
  computed: {
    ...mapGetters(['getFilteredAndSortedParameterList'])
  },
  methods: {
    ...mapMutations(['removeParameter'])
  }
}
</script>

<style lang="scss"></style>
