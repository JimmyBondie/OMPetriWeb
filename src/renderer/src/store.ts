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

class StoreState extends Object {
  public get hierarchyService(): IHierarchyService {
    return services.hierarchyService
  }

  public get modelService(): IModelService {
    return services.modelService
  }

  public get parameterService(): IParameterService {
    return services.parameterService
  }

  public get resultsService(): IResultService {
    return services.resultService
  }

  public get simulationService(): ISimulationService {
    return services.simulationService
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
        model = services.modelSbmlConverter.importSbml(content)
      } else {
        model = services.modelXmlConverter.importXML(content)
      }
    }
    return model
  }

  public async openResults(): Promise<Array<Simulation>> {
    const fileList: Array<[string, string]> = await this.openFile('text/xml')
    let simulations: Array<Simulation> = new Array<Simulation>()
    for (const [_, content] of fileList) {
      simulations.push(...services.resultsXmlConverter.importXml(content))
    }
    for (const simulation of simulations) {
      this.resultsService.addResult(simulation)
    }
    return simulations
  }

  public saveModel(dao: ModelDAO) {
    const file: File = new File([services.modelXmlConverter.writeXml(dao)], `${dao.name}.xml`, {
      type: 'text/xml;charset=utf-8',
      endings: 'native'
    })

    saveAs(file)
    dao.hasChanges = false
  }

  public saveResults(resultSets: Array<ResultSet>) {
    const file: File = new File([services.resultsXmlConverter.exportResultSets(resultSets)], '', {
      type: 'text/xml;charset=utf-8',
      endings: 'native'
    })

    saveAs(file)
  }

  public saveSimulations(simulationResults: Array<Simulation>) {
    const file: File = new File(
      [services.resultsXmlConverter.exportSimulationResults(simulationResults)],
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
    findParameter:
      (state: StoreState) =>
      (model: Model, id: string, element: IElement): Parameter | undefined => {
        return state.parameterService.findParameter(model, id, element)
      },
    getFilteredAndSortedParameterList:
      (state: StoreState) =>
      (model: Model, element: IDataElement, filter: string): Array<Parameter> => {
        return state.parameterService.getFilteredAndSortedParameterList(model, element, filter)
      },
    getFilteredChoicesForLocalParameters: (state: StoreState) => (model: Model, filter: string) => {
      return state.parameterService.getFilteredChoicesForLocalParameters(model, filter)
    },
    getModels: (state: StoreState): Array<ModelDAO> => {
      return state.modelService.models
    },
    getSharedValues:
      (state: StoreState) =>
      (results: Simulation, elements: Array<IElement>): Map<string, Array<string>> => {
        return state.resultsService.getSharedValues(results, elements)
      },
    getSimulationResults: (state: StoreState): Array<Simulation> => {
      return state.resultsService.simulationResults
    },
    getValueName:
      (state: StoreState) =>
      (value: string, simulation: Simulation): string => {
        return state.resultsService.getValueName(value, simulation)
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
    removeElement(state: StoreState, { dao, element }) {
      state.modelService.removeElement(dao, element)
    },
    removeModel(state: StoreState, model: ModelDAO) {
      state.modelService.removeModel(model)
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
  }
})

export default store
