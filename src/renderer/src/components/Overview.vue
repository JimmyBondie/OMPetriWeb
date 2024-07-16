<script setup lang="ts">
import { mergeProps } from 'vue'
import Editor from './Editor.vue'
</script>

<template>
  <main>
    <v-tabs v-model="selectedModel" bg-color="secondary">
      <!-- Tabs -->
      <v-tab v-for="model in getModels" :value="model">
        {{ model.name }}

        <v-dialog max-width="500">
          <template v-slot:activator="{ props: dialog }">
            <v-tooltip :text="$t('Close')" location="bottom">
              <template v-slot:activator="{ props: tooltip }">
                <v-hover>
                  <template v-slot:default="{ isHovering, props: hover }">
                    <v-btn
                      class="ml-2"
                      v-bind="mergeProps(dialog, tooltip, hover)"
                      :icon="model.hasChanges && !isHovering ? 'mdi-circle' : 'mdi-close'"
                      variant="text"
                      size="x-small"
                      density="comfortable"
                    ></v-btn>
                  </template>
                </v-hover>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card>
              <v-card-text>{{ $t('WantToSaveChanges', { name: model.name }) }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="
                    () => {
                      isActive.value = false
                      saveModel(model)
                      closeModel(model)
                    }
                  "
                  >{{ $t('Yes') }}</v-btn
                >
                <v-btn
                  @click="
                    () => {
                      isActive.value = false
                      closeModel(model)
                    }
                  "
                  >{{ $t('No') }}</v-btn
                >
                <v-btn @click="isActive.value = false">{{ $t('Cancel') }}</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-tab>

      <!-- Create new -->
      <v-tooltip :text="$t('New')" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            :data-tg-tour="$t('NewDescription')"
            :data-tg-title="$t('New')"
            data-tg-order="2"
            icon="mdi-plus"
            variant="text"
            v-bind="props"
            @click="addModel"
          ></v-btn>
        </template>
      </v-tooltip>

      <!-- Load from file -->
      <v-tooltip :text="$t('Open')" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            :data-tg-tour="$t('OpenDescription')"
            :data-tg-title="$t('Open')"
            data-tg-order="3"
            icon="mdi-open-in-app"
            variant="text"
            v-bind="props"
            @click="openNewModule()"
          ></v-btn>
        </template>
      </v-tooltip>
    </v-tabs>

    <v-window v-model="selectedModel" class="window-without-tabs">
      <v-window-item v-for="model in getModels" :value="model" class="h-100">
        <v-app>
          <Editor :dao="model" class="h-100"></Editor>
        </v-app>
      </v-window-item>
    </v-window>
  </main>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { TourGuideClient } from '@sjmc11/tourguidejs'

export default {
  data() {
    return {
      selectedModel: undefined as ModelDAO | undefined
    }
  },
  computed: {
    ...mapGetters(['getModels', 'getTour'])
  },
  methods: {
    ...mapGetters(['addNewModel']),
    ...mapMutations(['removeModel', 'saveModel']),
    ...mapActions(['openModel']),
    addModel() {
      const model: ModelDAO = this.addNewModel()
      this.selectedModel = model
    },
    closeModel(model: ModelDAO) {
      this.removeModel(model)
    },
    async openNewModule() {
      const model: ModelDAO | null = await this.openModel()
      if (model) {
        this.selectedModel = model
      }
    }
  },
  mounted() {
    const tour: TourGuideClient = this.getTour
    if (tour.isVisible) {
      tour.refresh()
    }
  }
}
</script>

<style lang="scss">
.window-without-tabs {
  height: calc(100% - 48px); // The height of the tabs is 48px
  .v-window__container {
    height: 100%;
  }
}
</style>
