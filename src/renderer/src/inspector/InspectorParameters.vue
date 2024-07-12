<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { mapGetters, mapMutations } from 'vuex'
import InspectorParameter from './InspectorParameter.vue'
import { GlobalParameter } from '@renderer/core/Parameter/GlobalParameter'
import { ParameterException } from '@renderer/services/impl/Exceptions'

defineProps<{
  dao: ModelDAO
  dataElement: IDataElement
}>()
</script>

<template>
  <v-overlay
    v-if="dao && newParameter"
    v-model="addNewParameter"
    class="align-center justify-center"
    content-class="w-75"
    contained
    persistent
    no-click-animation
  >
    <v-card rounded>
      <v-container class="pa-7">
        <v-row>
          <v-col>
            <InspectorParameter
              :dao="dao"
              :data-element="dataElement"
              v-on:new-id="(value: string) => (newParameterId = value)"
              :parameter="<Parameter>newParameter"
            ></InspectorParameter>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions class="float-end">
        <v-btn color="error" @click="addNewParameter = false">
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn
          color="success"
          @click="
            () => {
              createParameter()
              addNewParameter = false
            }
          "
        >
          {{ $t('OK') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>

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

            <v-tooltip :text="$t('Add')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  icon="mdi-plus"
                  @click="
                    () => {
                      newParameter = new GlobalParameter('', '')
                      addNewParameter = true
                    }
                  "
                ></v-btn>
              </template>
            </v-tooltip>
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
      <InspectorParameter
        :dao="dao"
        :data-element="dataElement"
        :parameter="<Parameter>selectedParameters[0]"
      ></InspectorParameter>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {
      addNewParameter: false as boolean,
      askDelete: false as boolean,
      newParameter: null as Parameter | null,
      newParameterId: '' as string,
      parameterToDelete: null as Parameter | null,
      filter: '',
      selectedParameters: [] as Array<Parameter>
    }
  },
  computed: {
    ...mapGetters([
      'createGlobalParameter',
      'createLocalParameter',
      'getFilteredAndSortedParameterList'
    ])
  },
  methods: {
    ...mapMutations(['addParameter', 'removeParameter']),
    createParameter() {
      if (!this.newParameter) {
        return
      }

      let param: Parameter
      switch (this.newParameter.type) {
        case ParameterType.GLOBAL: {
          param = this.createGlobalParameter(this.newParameterId, this.newParameter.value)
          break
        }

        case ParameterType.LOCAL: {
          param = this.createLocalParameter(
            this.newParameterId,
            this.newParameter.value,
            this.dataElement
          )
          break
        }

        default: {
          throw new ParameterException(this.$t('CannotCreateParameterOtherLocalOrGlobal'))
        }
      }

      this.addParameter({ model: this.dao.model, param: param })
    }
  }
}
</script>

<style lang="scss"></style>
