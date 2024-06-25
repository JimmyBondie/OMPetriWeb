<script setup lang="ts">
import QuickViewElement from './QuickViewElement.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { DataClusterArc } from '@renderer/data/impl/DataClusterArc'

defineProps<{
  clusterArc: DataClusterArc
  dao: ModelDAO
  shape: IGraphElement
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewElement :dao="dao" :element="clusterArc" :shape="shape"></QuickViewElement>

  <v-divider class="mt-6 mb-5"></v-divider>

  <!-- Nodes -->
  <v-list density="compact">
    <v-list-subheader>
      {{ $t('Arcs') }}
    </v-list-subheader>

    <v-list-item
      v-for="arc of clusterArc.storedArcs.values()"
      :value="arc"
      density="compact"
      rounded
      :base-color="arc.disabled ? 'grey' : undefined"
    >
      <v-list-item-title>
        {{ arc.data.source.id }}
        <v-icon icon="mdi-arrow-right-thin"></v-icon>
        {{ arc.data.target.id }}
      </v-list-item-title>

      <template v-slot:append>
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
</template>

<script lang="ts"></script>

<style lang="scss"></style>
