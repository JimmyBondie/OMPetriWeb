<script setup lang="ts">
import { DataPlace } from '@renderer/data/impl/DataPlace'
import QuickViewNode from './QuickViewNode.vue'
import SelectPlaceType from '@renderer/selects/SelectPlaceType.vue'

defineProps<{
  place: DataPlace
}>()
</script>

<template>
  <!-- General options -->
  <QuickViewNode :node="place"></QuickViewNode>

  <v-divider class="mb-5"></v-divider>

  <!-- Type -->
  <SelectPlaceType :place="place"></SelectPlaceType>

  <!-- Color -->
  <v-select
    :model-value="place.getColor()"
    :items="place.getColors()"
    item-title="id"
    item-value="description"
    prepend-icon="mdi-palette"
    density="compact"
    :open-text="$t('Open')"
    :close-text="$t('Close')"
    disabled
  >
    <template v-slot:append
      ><v-btn>{{ $t('New') }}</v-btn>
    </template>
  </v-select>

  <!-- Constant -->
  <v-checkbox :label="$t('Constant')" v-model="place.constant" prepend-icon="mdi-equal">
  </v-checkbox>

  <!-- Token -->
  <v-text-field
    :label="$t('Token')"
    v-model="place.token"
    variant="underlined"
    prepend-icon="mdi-dots-grid"
    type="number"
  ></v-text-field>

  <!-- Token min -->
  <v-text-field
    :label="$t('TokenMin')"
    v-model="place.tokenMin"
    variant="underlined"
    prepend-icon="mdi-speedometer-slow"
    type="number"
  ></v-text-field>

  <!-- Token max -->
  <v-text-field
    :label="$t('TokenMax')"
    v-model="place.tokenMax"
    variant="underlined"
    prepend-icon="mdi-speedometer"
    type="number"
  ></v-text-field>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
