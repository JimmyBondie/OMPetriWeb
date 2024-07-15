<script setup lang="ts">
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { Node } from '@renderer/entity/impl/Node'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import { ResultSet } from '@renderer/result/ResultSet'
import { Simulation } from '@renderer/result/Simulation'
import { mergeProps } from 'vue'
import { VTextarea } from 'vuetify/lib/components/index.mjs'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VChart from 'vue-echarts'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { ECharts, EChartsOption, LineSeriesOption } from 'echarts'
import { XAXisOption } from 'echarts/types/dist/shared'
import { Splitpanes, Pane } from 'splitpanes'

defineProps<{
  dao?: ModelDAO
}>()
</script>

<template>
  <main class="h-100">
    <v-overlay
      v-if="dao"
      v-model="startStop"
      class="align-center justify-center"
      content-class="w-75"
      contained
      persistent
      no-click-animation
    >
      <v-card rounded>
        <v-progress-linear color="primary" :indeterminate="inSimulation"></v-progress-linear>

        <v-card-title style="display: contents">
          <v-btn
            class="float-right"
            icon="mdi-close"
            density="compact"
            variant="text"
            :disabled="inSimulation"
            @click="startStop = false"
          ></v-btn>
        </v-card-title>

        <v-container class="pa-7">
          <v-row justify="center">
            <v-col class="d-flex justify-center">
              <v-tooltip
                :text="
                  inBrowser
                    ? $t('PleaseDownloadDesktopAppForSimulation')
                    : $t('CouldNotFindOpenModelicaInstallation')
                "
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
                </template>
              </v-tooltip>
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
              <v-btn
                prepend-icon="mdi-open-in-app"
                :disabled="inSimulation"
                stacked
                @click="
                  openResults().then(() => {
                    startStop = false
                  })
                "
              >
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
              <v-btn color="secondary" block @click="startStop = false">
                {{ $t('SimulationFinishedShowResults') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-overlay>

    <v-toolbar :color="dao ? '' : 'secondary'">
      <!-- Select model -->
      <v-autocomplete
        v-if="!dao"
        class="ml-2"
        :label="$t('Model')"
        :items="getModels()"
        item-title="name"
        v-model="<ModelDAO>selectedDAO"
        return-object
        density="compact"
        hide-details
      ></v-autocomplete>

      <!-- Select simulation -->
      <v-autocomplete
        class="ml-2"
        :label="$t('Simulation')"
        :items="getSimulations()"
        item-title="dateTimeString"
        v-model="<Simulation>selectedSimulation"
        return-object
        :disabled="!selectedDAO || startStop"
        density="compact"
        hide-details
      ></v-autocomplete>

      <!-- Select element -->
      <v-autocomplete
        class="ml-2 noWrapChips"
        :label="$t('Element')"
        :items="getElements()"
        v-model="selectedElements"
        :disabled="!selectedSimulation"
        density="compact"
        hide-details
        multiple
        chips
        max-width="300"
      >
        <template v-slot:item="{ props, item }">
          <v-list-subheader v-if="item.raw.isHeader">{{ item.raw.title }}</v-list-subheader>
          <v-list-item v-else v-bind="props" :title="item.raw.title">
            <template v-slot:prepend="{ isActive }">
              <v-list-item-action start>
                <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>

      <!-- Select value -->
      <v-autocomplete
        class="ml-2"
        :label="$t('Value')"
        :items="getValues()"
        v-model="selectedValues"
        :disabled="selectedElements.length == 0"
        density="compact"
        hide-details
      >
      </v-autocomplete>

      <!-- Add to table -->
      <v-btn
        class="ml-2"
        variant="tonal"
        prepend-icon="mdi-arrow-right"
        :disabled="selectedValues.length == 0"
        @click="addSelected"
      >
        {{ $t('Add') }}
      </v-btn>

      <v-spacer></v-spacer>

      <!-- New simulation -->
      <v-tooltip
        :text="inBrowser ? $t('PleaseDownloadDesktopAppForSimulation') : $t('NewSimulation')"
        location="top"
      >
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <v-btn
              v-if="dao"
              icon="mdi-play"
              variant="text"
              :disabled="simulationNotPossible"
              @click="startStop = true"
            ></v-btn>
          </div>
        </template>
      </v-tooltip>

      <!-- Load from file -->
      <v-tooltip :text="$t('Open')" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-if="!dao"
            icon="mdi-open-in-app"
            variant="text"
            v-bind="props"
            @click="openResults"
          ></v-btn>
        </template>
      </v-tooltip>

      <!-- Save -->
      <v-tooltip :text="$t('Save')" location="top">
        <template v-slot:activator="{ props: tooltip }">
          <v-speed-dial location="bottom">
            <template v-slot:activator="{ props: activator }">
              <v-btn
                icon="mdi-content-save-edit-outline"
                variant="text"
                v-bind="mergeProps(tooltip, activator)"
              ></v-btn>
            </template>

            <v-btn key="1" @click="saveResults(selectedResultSets)">{{ $t('OnlySelected') }}</v-btn>
            <v-btn key="2" @click="saveSimulations(getSimulationResults())">{{ $t('All') }}</v-btn>
          </v-speed-dial>
        </template>
      </v-tooltip>
    </v-toolbar>

    <splitpanes style="height: calc(100% - 64px)" class="splitpanes">
      <pane>
        <v-data-table
          class="h-100"
          :items-per-page-options="[
            10,
            25,
            50,
            100,
            {
              value: -1,
              title: $t('All')
            }
          ]"
          v-model="selectedResultSets"
          :headers="getHeaders()"
          :items="resultSets"
          return-object
          show-select
        >
          <template v-slot:header.delete>
            <v-btn
              color="error"
              icon="mdi-trash-can-outline"
              variant="text"
              @click="
                () => {
                  selectedResultSets = []
                  resultSets = []
                }
              "
            ></v-btn>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td style="padding: 0 8px">
                <v-checkbox-btn
                  v-model="selectedResultSets"
                  :value="item"
                  @update:model-value="item.shown = !item.shown"
                ></v-checkbox-btn>
              </td>
              <td>
                {{ (item as ResultSet).simulation.dateTimeString }}
              </td>
              <td>{{ (item as ResultSet).simulation.dao.name }}</td>
              <td>{{ (item as ResultSet).element.id }}</td>
              <td>{{ getValueName()((item as ResultSet).variable, selectedSimulation) }}</td>
              <td>{{ formatNumber(getStartValue(item as ResultSet)) }}</td>
              <td>{{ formatNumber(getEndValue(item as ResultSet)) }}</td>
              <td>{{ formatNumber(getMinValue(item as ResultSet)) }}</td>
              <td>{{ formatNumber(getMaxValue(item as ResultSet)) }}</td>
              <td>
                <v-btn
                  color="error"
                  icon="mdi-trash-can-outline"
                  variant="text"
                  @click="removeFromResultSets(item as ResultSet)"
                ></v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </pane>
      <pane style="padding-top: 20px">
        <v-chart autoresize :theme="theme" :option="getChartOptions()" ref="chart"></v-chart>
      </pane>
    </splitpanes>
  </main>
</template>

<script lang="ts">
class AutocompleteWrapper<T> extends Object {
  title: string
  value: T | undefined

  public constructor(title: string, value?: T) {
    super()
    this.title = title
    this.value = value
  }

  public get isHeader(): boolean {
    return !this.value
  }
}

export default {
  data() {
    return {
      inBrowser: !window.api,
      inSimulation: false,
      intervals: 100,
      logText: '',
      optionalCompilerArgs: '',
      optionalSimulationArgs: '',
      resultSets: [] as Array<ResultSet>,
      selectedDAO: this.dao as ModelDAO | undefined,
      selectedElements: [] as Array<Node>,
      selectedResultSets: [] as Array<ResultSet>,
      selectedSimulation: undefined as Simulation | undefined,
      selectedValues: [] as Array<string>,
      showLog: false,
      showResultsBtn: false,
      simulationNotPossible: !this.simulationCompilerExists(),
      simulationIntegrator: 'dassl',
      startStop: this.dao != undefined,
      stopTime: 10,
      theme: useTheme().global.name,
      thread: undefined as AbortController | undefined
    }
  },
  components: {
    Splitpanes,
    Pane
  },
  methods: {
    ...mapGetters([
      'getSharedValues',
      'getSimulationResults',
      'getValueName',
      'simulationCompilerExists',
      'startSimulation'
    ]),
    ...mapMutations(['saveResults', 'saveSimulations']),
    ...mapActions(['openResults']),
    addSelected() {
      if (!this.selectedSimulation) {
        return
      }

      for (const value of this.selectedValues) {
        const element: IElement | undefined = this.selectedSimulation.getFilterElement(value)
        if (!element) {
          continue
        }

        this.resultSets.push(new ResultSet(this.selectedSimulation as Simulation, element, value))
      }
    },
    compareNumbers(a: number | bigint, b: number | bigint): number {
      if (a == b) {
        return 0
      } else if (a < b) {
        return -1
      } else {
        return 1
      }
    },
    formatNumber(value: number | bigint): string {
      if (typeof value === 'bigint') {
        return value.toString()
      } else {
        return value.toFixed(2)
      }
    },
    getChartOptions(): EChartsOption {
      const options: EChartsOption = {
        backgroundColor: 'rgb(var(--v-theme-surface))',
        dataZoom: {},
        legend: {
          show: true
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'item'
        },
        yAxis: {
          type: 'value',
          name: this.$t('Token')
        }
      }

      let timeValues: Array<string> = new Array<string>()
      if (this.selectedSimulation) {
        const timeData: Array<number | bigint> | undefined = this.selectedSimulation.timeData
        if (timeData) {
          timeValues = timeData.map<string>((value: number | bigint) => this.formatNumber(value))
        }
      }

      const xAxis: XAXisOption = {
        type: 'category',
        name: this.$t('Time'),
        data: timeValues
      }

      const series: Array<LineSeriesOption> = new Array<LineSeriesOption>()
      for (const resultSet of this.selectedResultSets) {
        series.push({
          type: 'line',
          data: resultSet.data.map<string>((value: number | bigint) => this.formatNumber(value)),
          name: `${resultSet.element.id} - ${this.getValueName()(resultSet.variable, this.selectedSimulation)}`
        })
      }

      options.xAxis = xAxis
      options.series = series
      return options
    },
    getElements(): Array<AutocompleteWrapper<Node>> {
      if (!this.selectedSimulation) {
        return new Array<AutocompleteWrapper<Node>>()
      }

      const places: Array<Node> = new Array<Node>()
      const transitions: Array<Node> = new Array<Node>()

      const allElements: Array<Node> = (this.selectedSimulation.elements as Array<IElement>)
        .filter<Node>((item: IElement): item is Node => item.elementType != ElementType.ARC)
        .sort((n1: Node, n2: Node) => n1.elementType - n2.elementType)

      for (const element of allElements) {
        if (element.elementType == ElementType.PLACE) {
          places.push(element)
        } else {
          transitions.push(element)
        }
      }

      const result: Array<AutocompleteWrapper<Node>> = new Array<AutocompleteWrapper<Node>>()
      places.sort((a: Node, b: Node) => a.id.localeCompare(b.id))
      transitions.sort((a: Node, b: Node) => a.id.localeCompare(b.id))

      if (places.length > 0) {
        result.push(new AutocompleteWrapper<Node>(this.$t('Places')))
        for (const place of places) {
          result.push(new AutocompleteWrapper<Node>(place.id, place))
        }
      }
      if (transitions.length > 0) {
        result.push(new AutocompleteWrapper<Node>(this.$t('Transitions')))
        for (const transition of transitions) {
          result.push(new AutocompleteWrapper<Node>(transition.id, transition))
        }
      }
      return result
    },
    getEndValue(resultSet: ResultSet): number | bigint {
      if (resultSet.data.length == 0) {
        return 0
      } else {
        return resultSet.data[resultSet.data.length - 1]
      }
    },
    getHeaders(): Array<{
      key?: string
      title?: string
      sortable?: boolean
      sortRaw?: (a: ResultSet, b: ResultSet) => number
    }> {
      return [
        {
          key: 'date',
          title: this.$t('Date'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            a.simulation.dateTime.getTime() - b.simulation.dateTime.getTime()
        },
        {
          key: 'model',
          title: this.$t('Model'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            a.simulation.dao.name.localeCompare(b.simulation.dao.name)
        },
        {
          key: 'id',
          title: this.$t('ID'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number => a.element.id.localeCompare(b.element.id)
        },
        {
          key: 'value',
          title: this.$t('Value'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            this.getValueName()(a.variable, this.selectedSimulation).localeCompare(
              this.getValueName()(b.variable, this.selectedSimulation)
            )
        },
        {
          key: 'start',
          title: this.$t('Start'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            this.compareNumbers(this.getStartValue(a), this.getStartValue(b))
        },
        {
          key: 'end',
          title: this.$t('End'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            this.compareNumbers(this.getEndValue(a), this.getEndValue(b))
        },
        {
          key: 'min',
          title: this.$t('Min'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            this.compareNumbers(this.getMinValue(a), this.getMinValue(b))
        },
        {
          key: 'max',
          title: this.$t('Max'),
          sortable: true,
          sortRaw: (a: ResultSet, b: ResultSet): number =>
            this.compareNumbers(this.getMaxValue(a), this.getMaxValue(b))
        },
        { key: 'delete', title: this.$t('Delete'), sortable: false }
      ]
    },
    getMaxValue(resultSet: ResultSet): number | bigint {
      let max: number | bigint = 0
      for (const value of resultSet.data) {
        if (value > max) {
          max = value
        }
      }
      return max
    },
    getMinValue(resultSet: ResultSet): number | bigint {
      if (resultSet.data.length == 0) {
        return 0
      }

      let min: number | bigint = resultSet.data[0]
      for (const value of resultSet.data) {
        if (value < min) {
          min = value
        }
      }
      return min
    },
    getModels(): Array<ModelDAO> {
      const simulations: Array<Simulation> = this.getSimulationResults()
      return simulations
        .map<ModelDAO>((item: Simulation) => item.dao)
        .sort((d1: ModelDAO, d2: ModelDAO) => d1.name.localeCompare(d2.name))
    },
    getSimulations(): Array<Simulation> {
      const simulations: Array<Simulation> = this.getSimulationResults()
      return simulations
        .filter((sim: Simulation) => sim.dao == this.selectedDAO)
        .sort((s1: Simulation, s2: Simulation) => s1.dateTime.getTime() - s2.dateTime.getTime())
    },
    getStartValue(resultSet: ResultSet): number | bigint {
      if (resultSet.data.length == 0) {
        return 0
      } else {
        return resultSet.data[0]
      }
    },
    getValues(): Array<AutocompleteWrapper<Array<string>>> {
      if (!this.selectedSimulation) {
        return new Array<AutocompleteWrapper<Array<string>>>()
      }

      const choices: Array<AutocompleteWrapper<Array<string>>> = new Array<
        AutocompleteWrapper<Array<string>>
      >()

      if (this.selectedElements.length == 1) {
        const valueStrings: Set<string> = this.selectedSimulation.getElementFilter(
          this.selectedElements[0] as Node
        )
        for (const value of valueStrings) {
          const name: string = this.getValueName()(value, this.selectedSimulation)
          if (name != '') {
            choices.push(new AutocompleteWrapper<Array<string>>(name, [value]))
          }
        }
      } else {
        const valuesMap: Map<string, Array<string>> = this.getSharedValues()(
          this.selectedSimulation,
          this.selectedElements
        )

        for (const [name, values] of valuesMap) {
          choices.push(new AutocompleteWrapper<Array<string>>(name, values))
        }
      }

      return choices.filter(
        (choice: AutocompleteWrapper<Array<string>>): boolean =>
          choice.value != undefined &&
          choice.value.some(
            (value: string): boolean =>
              this.selectedSimulation != undefined &&
              this.selectedSimulation.getData(value).length > 0
          )
      )
    },
    removeFromResultSets(resultSet: ResultSet) {
      let index: number = this.resultSets.indexOf(resultSet)
      if (index >= 0) {
        this.resultSets.splice(index, 1)
      }

      index = this.selectedResultSets.indexOf(resultSet)
      if (index >= 0) {
        this.selectedResultSets.splice(index, 1)
      }
    },
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
  },
  watch: {
    selectedResultSets() {
      let chart: ECharts = this.$refs.chart as ECharts
      chart.setOption(this.getChartOptions())
    }
  }
}
</script>

<style lang="scss">
@import 'splitpanes/dist/splitpanes.css';

.noWrapChips {
  .v-field__input {
    flex-wrap: nowrap;
    overflow: hidden;
  }
}

.splitpanes {
  .splitpanes__pane {
    background: rgb(var(--v-theme-surface));
    transition: none;
  }

  .splitpanes__splitter {
    width: 4px;
    border: 1.5px solid rgb(var(--v-theme-surface));
    transition: background-color 0.1s ease-out;
    background-color: rgba(var(--v-border-color), var(--v-border-opacity));
    &:hover {
      border-color: rgb(var(--v-theme-primary));
      background-color: rgb(var(--v-theme-primary));
    }
  }
}
</style>
