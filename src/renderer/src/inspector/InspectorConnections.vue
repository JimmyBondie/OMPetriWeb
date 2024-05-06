<script setup lang="ts">
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

defineProps<{
  dataNode: IDataNode
  onShowElement?: (element: IGraphElement) => void
}>()
</script>

<template>
  <v-row class="pa-4">
    <v-col>
      <!-- Arcs in -->
      <v-list height="200" rounded density="compact">
        <v-list-subheader>{{ $t('IncomingArcs') }}</v-list-subheader>

        <v-list-item
          v-for="arc in dataNode.arcsIn"
          :value="arc"
          density="compact"
          :base-color="arc.disabled ? 'grey' : undefined"
          :title="arc.source.id"
        >
          <template v-slot:append>
            <v-tooltip :text="$t('Show')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-magnify" density="compact" variant="text"></v-btn>
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
          v-for="shape in dataNode.shapes"
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
        <v-list-subheader>{{ $t('OutgoingArcs') }}</v-list-subheader>

        <v-list-item
          v-for="arc in dataNode.arcsOut"
          :value="arc"
          density="compact"
          :base-color="arc.disabled ? 'grey' : undefined"
          :title="arc.target.id"
        >
          <template v-slot:append>
            <v-tooltip :text="$t('Show')" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-magnify" density="compact" variant="text"></v-btn>
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

<script lang="ts"></script>

<style lang="scss"></style>
