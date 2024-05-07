<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { INode } from '@renderer/entity/intf/INode'
import { Place } from '@renderer/entity/impl/Place'
import { Transition } from '@renderer/entity/impl/Transition'
import { Arc } from '@renderer/entity/impl/Arc'
import InspectorBasicProps from './InspectorBasicProps.vue'
import InspectorConnections from './InspectorConnections.vue'
import InspectorPlaceProps from './InspectorPlaceProps.vue'
import InspectorTransitionProps from './InspectorTransitionProps.vue'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import InspectorArcProps from './InspectorArcProps.vue'
import InspectorParameters from './InspectorParameters.vue'

defineProps<{
  activeElement: IDataElement | undefined
  dao: ModelDAO
  onShowElement?: (element: IGraphElement) => void
}>()
</script>

<template>
  <v-row no-gutters class="h-100">
    <!-- Node list -->
    <v-col class="h-100 overflow-y-auto" cols="3">
      <v-list density="compact" nav v-model:selected="selectedElements">
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
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-transit-detour"
              :title="$t('Places')"
              density="compact"
            ></v-list-item>
          </template>

          <v-list-item v-for="place in places" :value="place" density="compact">
            {{ place.id }}
          </v-list-item>
        </v-list-group>

        <!-- Transitions -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-transit-connection-horizontal"
              :title="$t('Transitions')"
              density="compact"
            ></v-list-item>
          </template>

          <v-list-item v-for="transition in transitions" :value="transition" density="compact">
            {{ transition.id }}
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>

    <!-- Inspector -->
    <v-col class="h-100" cols="9">
      <v-container
        v-if="selectedElements.length > 0 && selectedElements[0]"
        class="h-100 overflow-y-auto"
      >
        <!-- Properties -->
        <InspectorBasicProps
          :data-element="<IDataElement>selectedElements[0]"
        ></InspectorBasicProps>

        <v-divider></v-divider>

        <InspectorConnections
          :data-element="<IDataElement>selectedElements[0]"
          :on-show-element="
            (element: IGraphElement) => {
              if (onShowElement) {
                onShowElement(element)
              }
            }
          "
        ></InspectorConnections>

        <v-divider></v-divider>

        <v-row class="pa-4">
          <v-col>
            <InspectorPlaceProps
              v-if="selectedElements[0] instanceof Place"
              :place="selectedElements[0]"
            ></InspectorPlaceProps>

            <InspectorTransitionProps
              v-if="selectedElements[0] instanceof Transition"
              :dao="dao"
              :transition="selectedElements[0]"
            ></InspectorTransitionProps>

            <InspectorArcProps
              v-if="selectedElements[0] instanceof Arc"
              :dao="dao"
              :arc="selectedElements[0]"
            ></InspectorArcProps>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <InspectorParameters
          :dao="dao"
          :data-element="<IDataElement>selectedElements[0]"
        ></InspectorParameters>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {
      filter: '' as string,
      places: this.getPlaces() as Array<DataPlace>,
      transitions: this.getTransitions() as Array<DataTransition>,
      selectedElements: [] as Array<IDataElement>
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
  beforeMount() {
    if (this.activeElement) {
      this.selectedElements.push(this.activeElement)
    }
  },
  beforeUpdate() {
    this.places = this.getPlaces()
    this.transitions = this.getTransitions()
    if (this.activeElement) {
      this.selectedElements = [this.activeElement]
    }
  }
}
</script>

<style lang="scss"></style>
