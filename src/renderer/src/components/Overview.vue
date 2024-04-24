<script setup lang="ts">
import { mergeProps } from 'vue'
import Editor from './Editor.vue'
</script>

<template>
  <main>
    <v-tabs v-model="selectedModel" bg-color="secondary">
      <!-- Tabs -->
      <v-tab v-for="model in getModels" :value="model.id">
        {{ model.name }}

        <v-dialog max-width="500">
          <template v-slot:activator="{ props: dialog }">
            <v-tooltip :text="$t('Close')" location="bottom">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  v-bind="mergeProps(dialog, tooltip)"
                  icon="mdi-close"
                  variant="text"
                  size="x-small"
                  density="comfortable"
                ></v-btn>
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
          <v-btn icon="mdi-plus" variant="text" v-bind="props" @click="addNewModel"></v-btn>
        </template>
      </v-tooltip>

      <!-- Load from file -->
      <v-tooltip :text="$t('Open')" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-open-in-app"
            variant="text"
            v-bind="props"
            @click="openNewModule()"
          ></v-btn>
        </template>
      </v-tooltip>
    </v-tabs>

    <v-window v-model="selectedModel">
      <v-window-item v-for="model in getModels" :value="model.id">
        <Editor></Editor>
      </v-window-item>
    </v-window>

    <v-dialog max-width="500" v-model="showErrorMessage">
      <v-card :title="$t('Error')">
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showErrorMessage = false">{{ $t('Ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomError } from '@renderer/utils/CustomError'

export default {
  data() {
    return {
      errorMessage: '',
      selectedModel: '',
      showErrorMessage: false
    }
  },
  computed: {
    ...mapGetters(['getModels'])
  },
  methods: {
    ...mapMutations(['addNewModel', 'removeModel']),
    ...mapActions(['openModel']),
    closeModel(model: ModelDAO) {
      this.removeModel(model)
    },
    async openNewModule() {
      try {
        const model: ModelDAO | null = await this.openModel()
        if (model) {
          this.selectedModel = model.id
        }
      } catch (e: any) {
        if (e instanceof CustomError) {
          this.errorMessage = e.message
          this.showErrorMessage = true
        }
      }
    }
  }
}
</script>

<style lang="scss"></style>
