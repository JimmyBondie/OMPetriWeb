<script setup lang="ts">
import QuickViewElement from './QuickViewElement.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { DataCluster } from '@renderer/data/impl/DataCluster'

defineProps<{
  cluster: DataCluster
  dao: ModelDAO
  shape: IGraphElement
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewElement :dao="dao" :element="cluster" :shape="shape"></QuickViewElement>

  <v-divider class="mt-6 mb-5"></v-divider>

  <!-- Nodes -->
  <v-list density="compact">
    <v-list-subheader>
      {{ $t('Items') }}
    </v-list-subheader>

    <v-list-item
      v-for="node in cluster.graph.nodes"
      :value="node"
      density="compact"
      rounded
      :base-color="node.disabled ? 'grey' : undefined"
      :title="node.id"
    >
      <template v-slot:append>
        <v-tooltip :text="node.disabled ? $t('Enable') : $t('Disable')" location="top">
          <template v-slot:activator="{ props }">
            <v-switch
              density="compact"
              hide-details
              :false-value="true"
              :true-value="false"
              v-model="node.disabled"
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
