<script setup lang="ts">
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { DataArc } from '@renderer/data/impl/DataArc'
import DataElementDescriptionEdit from '@renderer/edits/DataElementDescriptionEdit.vue'
import PlaceTypeSelect from '@renderer/selects/PlaceTypeSelect.vue'
import TransitionTypeSelect from '@renderer/selects/TransitionTypeSelect.vue'
import DataElementTypeEdit from '@renderer/edits/DataElementTypeEdit.vue'
import ElementNameEdit from '@renderer/edits/ElementNameEdit.vue'
import DataElementLabelEdit from '@renderer/edits/DataElementLabelEdit.vue'
import ArcTypeSelect from '@renderer/selects/ArcTypeSelect.vue'
import { ModelDAO } from '@renderer/dao/ModelDAO'

defineProps<{
  dao: ModelDAO
  dataElement: IDataElement
}>()
</script>

<template>
  <v-row class="pa-4">
    <v-col>
      <!-- Types -->
      <v-row>
        <v-col>
          <PlaceTypeSelect
            v-if="dataElement instanceof DataPlace"
            :dao="dao"
            :place="dataElement"
          ></PlaceTypeSelect>
          <TransitionTypeSelect
            v-if="dataElement instanceof DataTransition"
            :dao="dao"
            :transition="dataElement"
          ></TransitionTypeSelect>
          <ArcTypeSelect
            v-if="dataElement instanceof DataArc"
            :arc="dataElement"
            :dao="dao"
          ></ArcTypeSelect>
        </v-col>
        <v-col>
          <DataElementTypeEdit :data-element="dataElement"></DataElementTypeEdit>
        </v-col>
      </v-row>

      <!-- Name -->
      <ElementNameEdit :dao="dao" :element="dataElement"></ElementNameEdit>

      <!-- Label -->
      <DataElementLabelEdit :data-element="dataElement"></DataElementLabelEdit>
    </v-col>

    <v-divider class="h-auto" vertical></v-divider>

    <v-col>
      <!-- Description -->
      <DataElementDescriptionEdit
        class="h-100"
        :data-element="dataElement"
        hide-details
      ></DataElementDescriptionEdit>
    </v-col>
  </v-row>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
