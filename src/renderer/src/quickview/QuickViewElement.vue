<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import DataElementDescriptionEdit from '@renderer/edits/DataElementDescriptionEdit.vue'
import DataElementLabelEdit from '@renderer/edits/DataElementLabelEdit.vue'
import DataElementTypeEdit from '@renderer/edits/DataElementTypeEdit.vue'
import ElementDisabledEdit from '@renderer/edits/ElementDisabledEdit.vue'
import ElementNameEdit from '@renderer/edits/ElementNameEdit.vue'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { mapMutations } from 'vuex'

defineProps<{
  dao: ModelDAO
  element: IDataElement
  shape: IGraphElement
}>()
</script>

<template>
  <!-- Type -->
  <DataElementTypeEdit :data-element="element"></DataElementTypeEdit>

  <!-- Name -->
  <ElementNameEdit :dao="dao" :element="element"></ElementNameEdit>

  <!-- Label -->
  <DataElementLabelEdit :data-element="element"></DataElementLabelEdit>

  <!-- Disabled -->
  <ElementDisabledEdit :element="element"></ElementDisabledEdit>

  <!-- Description -->
  <DataElementDescriptionEdit :data-element="element"></DataElementDescriptionEdit>

  <v-btn block color="error" prepend-icon="mdi-trash-can-outline" @click="askDelete = true">
    {{ $t('Delete') }}
  </v-btn>

  <v-dialog max-width="500" v-model="askDelete">
    <v-card>
      <v-card-text>{{ $t('WantToDeleteElement', { id: element.id }) }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="
            () => {
              askDelete = false
              removeElement({ dao: dao, element: shape })
            }
          "
          >{{ $t('Yes') }}</v-btn
        >
        <v-btn @click="askDelete = false">{{ $t('No') }}</v-btn>
        <v-btn @click="askDelete = false">{{ $t('Cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  data() {
    return {
      askDelete: false
    }
  },
  methods: {
    ...mapMutations(['removeElement'])
  }
}
</script>

<style lang="scss"></style>
