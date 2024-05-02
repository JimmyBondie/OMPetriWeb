<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { INode } from '@renderer/entity/intf/INode'

defineProps<{
  activeNode: IDataNode | undefined
  dao: ModelDAO
}>()
</script>

<template>
  <v-row no-gutters class="h-100">
    <!-- Node list -->
    <v-col class="h-100 overflow-y-auto" cols="3">
      <v-list density="compact" nav>
        <v-list-item density="compact">
          <v-text-field
            :placeholder="$t('FilterIdNameLabel')"
            prepend-icon="mdi-magnify"
            density="compact"
            hide-details
            v-model="filter"
          ></v-text-field>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Places -->
        <v-list-group value="Places">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-transit-detour"
              :title="$t('Places')"
              density="compact"
            ></v-list-item>
          </template>

          <v-list-item v-for="place in places" :value="place.id" density="compact">
            {{ place.id }}
          </v-list-item>
        </v-list-group>

        <!-- Transitions -->
        <v-list-group value="Transitions">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-transit-connection-horizontal"
              :title="$t('Transitions')"
              density="compact"
            ></v-list-item>
          </template>

          <v-list-item v-for="transition in transitions" :value="transition.id" density="compact">
            {{ transition.id }}
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>

    <!-- Inspector -->
    <v-col class="h-100" cols="10"> </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {
      filter: '' as string,
      places: this.getPlaces() as Array<DataPlace>,
      transitions: this.getTransitions() as Array<DataTransition>
    }
  },
  methods: {
    filterList<T extends IDataNode>(list: Array<INode>, type: new (...args: any[]) => T): Array<T> {
      const filterStr: string = this.filter ? this.filter.toLowerCase() : ''
      return list
        .filter<T>((value: INode): value is T => value instanceof type) // Filter by type
        .filter(
          // Use the text filter
          (node: T): boolean =>
            node.id.toLowerCase().includes(filterStr) ||
            node.description.toLowerCase().includes(filterStr) ||
            node.labelText.toLowerCase().includes(filterStr)
        )
    },
    getPlaces(): Array<DataPlace> {
      return this.filterList<DataPlace>(this.dao.model.placesSorted, DataPlace)
    },
    getTransitions(): Array<DataTransition> {
      return this.filterList<DataTransition>(this.dao.model.transitionsSorted, DataTransition)
    }
  },
  watch: {
    filter() {
      this.places = this.getPlaces()
      this.transitions = this.getTransitions()
    }
  },
  beforeUpdate() {
    this.places = this.getPlaces()
    this.transitions = this.getTransitions()
  }
}
</script>

<style lang="scss"></style>
