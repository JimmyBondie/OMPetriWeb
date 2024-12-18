import { UseFileDialogReturn, useFileDialog } from '@vueuse/core'
import { Store, createStore } from 'vuex'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { services } from '@renderer/services'
import { IModelService } from '@renderer/services/intf/IModelService'
import { IDataElement } from './data/intf/IDataElement'
import { Parameter } from './core/Parameter'
import { IParameterService } from './services/intf/IParameterService'
import { Model } from './core/Model'
import { IElement } from './entity/intf/IElement'
import { Function } from './core/Function'
import { saveAs } from 'file-saver'
import { ISimulationService } from './services/intf/ISimulationService'
import { Simulation } from './result/Simulation'
import { IResultService } from './services/intf/IResultService'
import { ResultSet } from './result/ResultSet'
import { IHierarchyService } from './services/intf/IHierarchyService'
import { ParameterFactory } from './utils/ParameterFactory'
import { utils } from './utils'
import { Color } from './core/Color'
import { IFactoryService } from './services/intf/IFactoryService'
import { TourGuideClient } from '@sjmc11/tourguidejs'
import i18n from './main'

class StoreStateSettings extends Object {
  initialStart: boolean = true
  language: string = ''
  nodeNamesPosition: string = ''
  showArcWeights: boolean = true
  showNodeNames: boolean = false
  theme: string = ''
}

export enum NodeNamesPosition {
  LEFT,
  BOTTOM,
  RIGHT,
  TOP
}

export namespace NodeNamesPosition {
  export function fromString(value: string | null): NodeNamesPosition {
    switch (value) {
      case 'LEFT':
        return NodeNamesPosition.LEFT
      case 'BOTTOM':
        return NodeNamesPosition.BOTTOM
      case 'RIGHT':
        return NodeNamesPosition.RIGHT
      case 'TOP':
        return NodeNamesPosition.TOP
      default:
        return NodeNamesPosition.BOTTOM
    }
  }

  export function toString(position: NodeNamesPosition): string {
    switch (position) {
      case NodeNamesPosition.LEFT:
        return 'LEFT'
      case NodeNamesPosition.BOTTOM:
        return 'BOTTOM'
      case NodeNamesPosition.RIGHT:
        return 'RIGHT'
      case NodeNamesPosition.TOP:
        return 'TOP'
    }
  }

  export function toText(position: NodeNamesPosition): string {
    switch (position) {
      case NodeNamesPosition.LEFT:
        return i18n.global.t('Left')
      case NodeNamesPosition.BOTTOM:
        return i18n.global.t('Bottom')
      case NodeNamesPosition.RIGHT:
        return i18n.global.t('Right')
      case NodeNamesPosition.TOP:
        return i18n.global.t('Top')
    }
  }

  export function values(): Array<{ type: NodeNamesPosition; name: string }> {
    return [
      {
        type: NodeNamesPosition.LEFT,
        name: NodeNamesPosition.toText(NodeNamesPosition.LEFT)
      },
      {
        type: NodeNamesPosition.BOTTOM,
        name: NodeNamesPosition.toText(NodeNamesPosition.BOTTOM)
      },
      {
        type: NodeNamesPosition.RIGHT,
        name: NodeNamesPosition.toText(NodeNamesPosition.RIGHT)
      },
      {
        type: NodeNamesPosition.TOP,
        name: NodeNamesPosition.toText(NodeNamesPosition.TOP)
      }
    ]
  }
}

class StoreState extends Object {
  private _settings: StoreStateSettings = new StoreStateSettings()
  private _tour: TourGuideClient = new TourGuideClient()

  public get factoryService(): IFactoryService {
    return services.factoryService
  }

  public get hierarchyService(): IHierarchyService {
    return services.hierarchyService
  }

  public get modelService(): IModelService {
    return services.modelService
  }

  public get parameterFactory(): ParameterFactory {
    return utils.parameterFactory
  }

  public get parameterService(): IParameterService {
    return services.parameterService
  }

  public get resultsService(): IResultService {
    return services.resultService
  }

  public get settings(): StoreStateSettings {
    return this._settings
  }

  public get simulationService(): ISimulationService {
    return services.simulationService
  }

  public get tour(): TourGuideClient {
    this._tour.setOptions({
      backdropColor: 'rgb(var(--v-theme-on-surface))',
      nextLabel: i18n.global.t('Next'),
      prevLabel: i18n.global.t('Back'),
      finishLabel: i18n.global.t('Finish')
    })

    return this._tour
  }

  public set settings(settings: StoreStateSettings) {
    this._settings = settings
  }

  public openFile(accept: string): Promise<Array<[string, string]>> {
    return new Promise<Array<[string, string]>>((resolve, _) => {
      const fileDialog: UseFileDialogReturn = useFileDialog({
        accept: accept
      })

      fileDialog.onChange(async (fileList: FileList | null) => {
        const result: Array<[string, string]> = new Array<[string, string]>()
        if (fileList) {
          for (const file of fileList) {
            result.push([file.name, await file.text()])
          }
        }
        resolve(result)
      })

      fileDialog.open()
    })
  }

  public async openModel(): Promise<ModelDAO | null> {
    const fileList: Array<[string, string]> = await this.openFile('text/xml,.sbml')
    let model: ModelDAO | null = null
    for (const [name, content] of fileList) {
      const extension: string | undefined = name.split('.').pop()
      if (extension && extension.localeCompare('sbml') == 0) {
        model = services.modelSBMLConverter.importSBML(content)
      } else {
        model = services.modelXMLConverter.importXML(content)
      }
    }
    return model
  }

  public async openResults(): Promise<Array<Simulation>> {
    const fileList: Array<[string, string]> = await this.openFile('text/xml')
    let simulations: Array<Simulation> = new Array<Simulation>()
    for (const [_, content] of fileList) {
      simulations.push(...services.resultsXMLConverter.importXML(content))
    }
    for (const simulation of simulations) {
      this.resultsService.addResult(simulation)
    }
    return simulations
  }

  public saveModel(dao: ModelDAO) {
    const file: File = new File([services.modelXMLConverter.writeXML(dao)], `${dao.name}.xml`, {
      type: 'text/xml;charset=utf-8',
      endings: 'native'
    })

    saveAs(file)
    dao.hasChanges = false
  }

  public saveResults(resultSets: Array<ResultSet>) {
    const file: File = new File([services.resultsXMLConverter.exportResultSets(resultSets)], '', {
      type: 'text/xml;charset=utf-8',
      endings: 'native'
    })

    saveAs(file)
  }

  public saveSimulations(simulationResults: Array<Simulation>) {
    const file: File = new File(
      [services.resultsXMLConverter.exportSimulationResults(simulationResults)],
      '',
      {
        type: 'text/xml;charset=utf-8',
        endings: 'native'
      }
    )

    saveAs(file)
  }
}

const store: Store<StoreState> = createStore({
  state(): StoreState {
    return new StoreState()
  },
  getters: {
    addNewModel: (state: StoreState): ModelDAO => {
      return state.modelService.newModel()
    },
    createGlobalParameter:
      (state: StoreState) =>
      (id: string, value: string): Parameter => {
        return state.parameterFactory.createGlobalParameter(id, value)
      },
    createLocalParameter:
      (state: StoreState) =>
      (id: string, value: string, reference: IElement): Parameter => {
        return state.parameterFactory.createLocalParameter(id, value, reference)
      },
    findParameter:
      (state: StoreState) =>
      (model: Model, id: string, element: IElement): Parameter | undefined => {
        return state.parameterService.findParameter(model, id, element)
      },
    getDefaultColor: (state: StoreState): Color => {
      return state.factoryService.colorDefault
    },
    getFilteredAndSortedParameterList:
      (state: StoreState) =>
      (model: Model, element: IDataElement, filter: string): Array<Parameter> => {
        return state.parameterService.getFilteredAndSortedParameterList(model, element, filter)
      },
    getFilteredChoicesForLocalParameters: (state: StoreState) => (model: Model, filter: string) => {
      return state.parameterService.getFilteredChoicesForLocalParameters(model, filter)
    },
    getLanguage: (state: StoreState): string => {
      return state.settings.language
    },
    getModels: (state: StoreState): Array<ModelDAO> => {
      return state.modelService.models
    },
    getNodeNamesPosition: (state: StoreState): NodeNamesPosition => {
      return NodeNamesPosition.fromString(state.settings.nodeNamesPosition)
    },
    getSharedValues:
      (state: StoreState) =>
      (results: Simulation, elements: Array<IElement>): Map<string, Array<string>> => {
        return state.resultsService.getSharedValues(results, elements)
      },
    getShowArcWeights: (state: StoreState): boolean => {
      return state.settings.showArcWeights
    },
    getShowNodeNames: (state: StoreState): boolean => {
      return state.settings.showNodeNames
    },
    getSimulationResults: (state: StoreState): Array<Simulation> => {
      return state.resultsService.simulationResults
    },
    getTheme: (state: StoreState): string => {
      return state.settings.theme
    },
    getTour: (state: StoreState): TourGuideClient => {
      return state.tour
    },
    getValueName:
      (state: StoreState) =>
      (value: string, simulation: Simulation): string => {
        return state.resultsService.getValueName(value, simulation)
      },
    isInitialStart: (state: StoreState): boolean => {
      return state.settings.initialStart
    },
    simulationCompilerExists: (state: StoreState): boolean => {
      return state.simulationService.simulationCompilerExists
    },
    startSimulation:
      (state: StoreState) =>
      (
        dao: ModelDAO,
        optionalCompilerArgs: string,
        optionalSimulationArgs: string,
        stopTime: number,
        intervals: number,
        integrator: string,
        log: (text: string) => void
      ): [AbortController, Promise<boolean>] => {
        return state.simulationService.startSimulation(
          dao,
          optionalCompilerArgs,
          optionalSimulationArgs,
          stopTime,
          intervals,
          integrator,
          log
        )
      },
    validateAndGetFunction:
      (state: StoreState) =>
      (model: Model, element: IElement, functionString: string): Function => {
        return state.parameterService.validateAndGetFunction(model, element, functionString)
      }
  },
  mutations: {
    addParameter(state: StoreState, { model, param }) {
      state.parameterService.add(model, param)
    },
    changeArcType(state: StoreState, { dao, arc, type }) {
      state.modelService.changeArcType(dao, arc, type)
    },
    changeElementId(state: StoreState, { dao, element, elementIdNew }) {
      state.modelService.changeElementId(dao, element, elementIdNew)
    },
    changePlaceType(state: StoreState, { dao, place, type }) {
      state.modelService.changePlaceType(dao, place, type)
    },
    changeTransitionType(state: StoreState, { dao, transition, type }) {
      state.modelService.changeTransitionType(dao, transition, type)
    },
    connect(state: StoreState, { dao, source, target }) {
      state.modelService.connect(dao, source, target)
    },
    createCluster(state: StoreState, { dao, selected }) {
      state.hierarchyService.cluster(dao, selected)
    },
    createNode(state: StoreState, { dao, cluster, type, posX, posY }) {
      state.modelService.create(dao, cluster, type, posX, posY)
    },
    paste(state: StoreState, { dao, nodes, cut }) {
      state.modelService.paste(dao, nodes, cut)
    },
    removeElement(state: StoreState, { dao, element }) {
      state.modelService.removeElement(dao, element)
    },
    removeElements(state: StoreState, { dao, elements }) {
      state.modelService.removeElements(dao, elements)
    },
    removeModel(state: StoreState, model: ModelDAO) {
      state.modelService.removeModel(model)
    },
    removeParameter(state: StoreState, { dao, parameter }) {
      state.parameterService.remove(dao, parameter)
    },
    saveModel(state: StoreState, dao: ModelDAO) {
      state.saveModel(dao)
    },
    saveResults(state: StoreState, resultSets: Array<ResultSet>) {
      state.saveResults(resultSets)
    },
    saveSimulations(state: StoreState, simulationResults: Array<Simulation>) {
      state.saveSimulations(simulationResults)
    },
    setElementFunction(state: StoreState, { model, element, func, color }) {
      state.parameterService.setElementFunction(model, element, func, color)
    },
    setLanguage(state: StoreState, language: string) {
      state.settings.language = language
    },
    setNodeNamesPosition(state: StoreState, nodeNamesPosition: NodeNamesPosition) {
      state.settings.nodeNamesPosition = NodeNamesPosition.toString(nodeNamesPosition)
    },
    setShowArcWeights(state: StoreState, showArcWeights: boolean) {
      state.settings.showArcWeights = showArcWeights
    },
    setShowNodeNames(state: StoreState, showNodeNames: boolean) {
      state.settings.showNodeNames = showNodeNames
    },
    setTheme(state: StoreState, theme: string) {
      state.settings.theme = theme
    },
    updateParameter(state: StoreState, { parameter, value, unit }) {
      state.parameterService.updateParameter(parameter, value, unit)
    }
  },
  actions: {
    openModel(context): Promise<ModelDAO | null> {
      return context.state.openModel()
    },
    openResults(context): Promise<Array<Simulation>> {
      return context.state.openResults()
    }
  },
  plugins: [
    (store: Store<StoreState>): void => {
      const key: string = 'settings'

      const data: string | null = localStorage.getItem(key)
      if (data) {
        const dataObj: StoreStateSettings = JSON.parse(data)
        if (
          typeof dataObj.language === 'string' &&
          typeof dataObj.showArcWeights === 'boolean' &&
          typeof dataObj.theme === 'string'
        ) {
          store.state.settings = dataObj
          store.state.settings.initialStart = false
        } else {
          localStorage.setItem(key, JSON.stringify(store.state.settings))
        }
      } else {
        localStorage.setItem(key, JSON.stringify(store.state.settings))
      }

      store.subscribe((_, state: StoreState) => {
        localStorage.setItem(key, JSON.stringify(state.settings))
      })
    }
  ]
})

export default store
