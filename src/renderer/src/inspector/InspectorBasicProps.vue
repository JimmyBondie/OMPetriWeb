<script setup lang="ts">
import { Place } from '@renderer/entity/impl/Place'
import { Transition } from '@renderer/entity/impl/Transition'
import { Arc } from '@renderer/entity/impl/Arc'
import { IDataElement } from '@renderer/data/intf/IDataElement'
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
            v-if="dataElement instanceof Place"
            :place="dataElement"
          ></PlaceTypeSelect>
          <TransitionTypeSelect
            v-if="dataElement instanceof Transition"
            :transition="dataElement"
          ></TransitionTypeSelect>
          <ArcTypeSelect v-if="dataElement instanceof Arc" :arc="dataElement"></ArcTypeSelect>
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
