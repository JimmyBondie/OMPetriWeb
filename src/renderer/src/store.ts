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

class StoreState extends Object {
  private _fileDialog: UseFileDialogReturn = useFileDialog({
    accept: 'text/xml,.sbml'
  })
  private _onLoadFile: ((fileList: FileList | null) => Promise<void>) | null = null

  public constructor() {
    super()
    this._fileDialog.onChange(async (fileList: FileList | null) => {
      if (this._onLoadFile) {
        await this._onLoadFile(fileList)
      }
    })
  }

  public get modelService(): IModelService {
    return services.modelService
  }

  public get parameterService(): IParameterService {
    return services.parameterService
  }

  public get simulationService(): ISimulationService {
    return services.simulationService
  }

  public openModel(): Promise<ModelDAO> {
    return new Promise<ModelDAO>((resolve, reject) => {
      this._onLoadFile = async (fileList: FileList | null) => {
        let model: ModelDAO | null = null
        if (fileList) {
          for (const file of fileList) {
            const text = await file.text()
            try {
              const extension: string | undefined = file.name.split('.').pop()
              if (extension && extension.localeCompare('sbml') == 0) {
                model = services.sbmlConverter.importSbml(text)
              } else {
                model = services.xmlConverter.importXML(text)
              }
            } catch (e: any) {
              reject(e)
            }
          }
          if (model) {
            resolve(model)
          } else {
            reject()
          }
        }
      }
      this._fileDialog.reset()
      this._fileDialog.open()
    })
  }

  public saveModel(dao: ModelDAO) {
    const file: File = new File([services.xmlConverter.writeXml(dao)], `${dao.name}.xml`, {
      type: 'text/xml;charset=utf-8',
      endings: 'native'
    })

    saveAs(file)
    dao.hasChanges = false
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
    createNode(state: StoreState, { dao, type, posX, posY }) {
      state.modelService.create(dao, type, posX, posY)
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
    setElementFunction(state: StoreState, { model, element, func, color }) {
      state.parameterService.setElementFunction(model, element, func, color)
    },
    updateParameter(state: StoreState, { parameter, value, unit }) {
      state.parameterService.updateParameter(parameter, value, unit)
    }
  },
  actions: {
    openModel(context): Promise<ModelDAO> {
      return context.state.openModel()
    }
  }
})

export default store
