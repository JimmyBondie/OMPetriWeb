<script setup lang="ts">
import { DataType } from '@renderer/data/intf/DataType'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IArc } from '@renderer/entity/intf/IArc'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

defineProps<{
  dataElement: IDataElement
  onShowElement?: (element: IGraphElement) => void
}>()
</script>

<template>
  <v-row class="pa-4">
    <v-col>
      <!-- Arcs in -->
      <v-list height="200" rounded density="compact">
        <v-list-subheader>
          {{ dataElement.type == DataType.ARC ? $t('IncomingNodes') : $t('IncomingArcs') }}
        </v-list-subheader>

        <v-list-item
          v-for="arc in getArcsIn()"
          :value="arc"
          density="compact"
          :base-color="arc.disabled ? 'grey' : undefined"
          :title="arc.source.id"
        >
          <template v-slot:append>
            <v-tooltip :text="$t('Show')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-magnify"
                  density="compact"
                  variant="text"
                  @click.stop=""
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="$t('Edit')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="ml-1 mr-2"
                  icon="mdi-pencil"
                  density="compact"
                  variant="text"
                  @click.stop=""
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="arc.disabled ? $t('Enable') : $t('Disable')" location="top">
              <template v-slot:activator="{ props }">
                <v-switch
                  density="compact"
                  hide-details
                  :false-value="true"
                  :true-value="false"
                  v-model="arc.disabled"
                  v-bind="props"
                ></v-switch>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>
    </v-col>

    <v-divider vertical class="h-auto"></v-divider>

    <!-- Graph entities -->
    <v-col>
      <v-list height="200" rounded density="compact">
        <v-list-subheader>{{ $t('GraphEntities') }}</v-list-subheader>

        <v-list-item
          v-for="shape in dataElement.shapes"
          :value="shape"
          density="compact"
          :base-color="shape.disabled ? 'grey' : undefined"
          :title="shape.id"
          @click.double="
            () => {
              if (onShowElement) {
                onShowElement(shape)
              }
            }
          "
        >
          <template v-slot:append>
            <v-tooltip :text="shape.disabled ? $t('Enable') : $t('Disable')" location="top">
              <template v-slot:activator="{ props }">
                <v-switch
                  density="compact"
                  hide-details
                  :false-value="true"
                  :true-value="false"
                  v-model="shape.disabled"
                  v-bind="props"
                ></v-switch>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>
    </v-col>

    <v-divider vertical class="h-auto"></v-divider>

    <!-- Arcs out -->
    <v-col>
      <v-list height="200" rounded density="compact">
        <v-list-subheader>
          {{ dataElement.type == DataType.ARC ? $t('OutgoingNodes') : $t('OutgoingArcs') }}
        </v-list-subheader>

        <v-list-item
          v-for="arc in getArcsOut()"
          :value="arc"
          density="compact"
          :base-color="arc.disabled ? 'grey' : undefined"
          :title="arc.target.id"
        >
          <template v-slot:append>
            <v-tooltip :text="$t('Show')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-magnify"
                  density="compact"
                  variant="text"
                  @click.stop=""
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="$t('Edit')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="ml-1 mr-2"
                  icon="mdi-pencil"
                  density="compact"
                  variant="text"
                  @click.stop=""
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="arc.disabled ? $t('Enable') : $t('Disable')" location="top">
              <template v-slot:activator="{ props }">
                <v-switch
                  density="compact"
                  hide-details
                  :false-value="true"
                  :true-value="false"
                  v-model="arc.disabled"
                  v-bind="props"
                ></v-switch>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  methods: {
    getArcsIn(): Array<IArc> {
      switch (this.dataElement.type) {
        case DataType.ARC:
          return [this.dataElement as IDataArc]
        default:
          return (this.dataElement as IDataNode).arcsIn
      }
    },
    getArcsOut(): Array<IArc> {
      switch (this.dataElement.type) {
        case DataType.ARC:
          return [this.dataElement as IDataArc]
        default:
          return (this.dataElement as IDataNode).arcsOut
      }
    }
  }
}
</script>

<style lang="scss"></style>
