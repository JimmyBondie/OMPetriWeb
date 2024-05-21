<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { VTextarea } from 'vuetify/lib/components/index.mjs'
import { mapGetters } from 'vuex'

defineProps<{
  dao: ModelDAO
}>()
</script>

<template>
  <v-overlay
    v-model="startStop"
    class="align-center justify-center"
    contained
    persistent
    no-click-animation
  >
    <v-card rounded>
      <v-progress-linear color="primary" :indeterminate="inSimulation"></v-progress-linear>
      <v-container class="pa-7">
        <v-row justify="center">
          <v-col class="d-flex justify-center">
            <v-tooltip
              :text="$t('PleaseDownloadDesktopAppForSimulation')"
              :disabled="!simulationNotPossible"
              location="top"
            >
              <template v-slot:activator="{ props: tooltip }">
                <div v-bind="tooltip">
                  <v-btn
                    prepend-icon="mdi-play"
                    :disabled="inSimulation || simulationNotPossible"
                    stacked
                    @click="runSimulation()"
                  >
                    {{ $t('Start') }}
                  </v-btn>
                </div>
              </template></v-tooltip
            >
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn
              prepend-icon="mdi-pause"
              :disabled="!inSimulation || simulationNotPossible"
              stacked
              @click="
                () => {
                  if (thread) {
                    thread.abort()
                  }
                }
              "
            >
              {{ $t('Stop') }}
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn prepend-icon="mdi-open-in-app" :disabled="inSimulation" stacked>
              {{ $t('Open') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="optionalCompilerArgs"
              density="compact"
              variant="underlined"
              :label="$t('OptionalCompilerArgs')"
              :placeholder="$t('ExampleArguments')"
              :disabled="inSimulation || simulationNotPossible"
              hide-details
              persistent-placeholder
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="optionalSimulationArgs"
              density="compact"
              variant="underlined"
              :label="$t('OptionalSimulationArgs')"
              :placeholder="$t('ExampleArguments')"
              :disabled="inSimulation || simulationNotPossible"
              hide-details
              persistent-placeholder
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-number-input
              v-model="stopTime"
              :label="$t('StopTime')"
              :disabled="inSimulation || simulationNotPossible"
              variant="underlined"
              control-variant="stacked"
              hide-details
            ></v-number-input>
          </v-col>
          <v-col>
            <v-number-input
              v-model="intervals"
              :label="$t('Intervals')"
              :disabled="inSimulation || simulationNotPossible"
              variant="underlined"
              control-variant="stacked"
              hide-details
            ></v-number-input>
          </v-col>
          <v-col>
            <v-select
              :label="$t('SimulationIntegrator')"
              :items="[
                'dassl',
                'euler',
                'lobatto2',
                'lobatto4',
                'lobatto6',
                'radau1',
                'radau3',
                'radau5'
              ]"
              v-model="simulationIntegrator"
              :disabled="inSimulation || simulationNotPossible"
              variant="underlined"
              persistent-placeholder
              hide-details
              :open-text="$t('Open')"
              :close-text="$t('Close')"
              :no-data-text="$t('NoDataAvailable')"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="showLog">
          <v-col>
            <v-textarea
              v-model="logText"
              hide-details
              no-resize
              variant="outlined"
              density="compact"
              readonly
              clearable
              persistent-clear
              persistent-placeholder
              prefix="$"
              ref="logTextElement"
            >
              <template v-slot:clear="{ props: clear }">
                <v-btn variant="text" density="compact" icon="mdi-close" v-bind="clear"></v-btn>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
        <v-row v-if="showResultsBtn">
          <v-col>
            <v-btn color="secondary" block>{{ $t('SimulationFinishedShowResults') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
export default {
  data() {
    return {
      intervals: 100,
      inSimulation: false,
      logText: '',
      optionalCompilerArgs: '',
      optionalSimulationArgs: '',
      showLog: false,
      showResultsBtn: false,
      simulationNotPossible: window.api == undefined,
      simulationIntegrator: 'dassl',
      startStop: true,
      stopTime: 10,
      thread: undefined as AbortController | undefined
    }
  },
  methods: {
    ...mapGetters(['startSimulation']),
    async runSimulation() {
      this.showResultsBtn = false
      this.logText = ''
      this.inSimulation = true
      this.showLog = true
      const [controller, promise] = this.startSimulation()(
        this.dao,
        this.optionalCompilerArgs,
        this.optionalSimulationArgs,
        this.stopTime,
        this.intervals,
        this.simulationIntegrator,
        (text: string) => {
          this.logText = `${this.logText}\n${text}`
          const element: HTMLTextAreaElement | undefined = this.$refs
            .logTextElement as HTMLTextAreaElement
          if (element && element.scrollHeight) {
            element.scrollTop = element.scrollHeight
          }
        }
      )

      this.thread = controller
      this.showResultsBtn = await promise
      this.inSimulation = false
    }
  }
}
</script>

<style lang="scss"></style>
