import { UseFileDialogReturn, useFileDialog } from '@vueuse/core'
import { Store, createStore } from 'vuex'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { services } from '@renderer/services'
import { IModelService } from '@renderer/services/intf/IModelService'
import { IDataElement } from './data/intf/IDataElement'
import { Parameter } from './core/Parameter'
import { IParameterService } from './services/intf/IParameterService'
import { Model } from './core/Model'

class StoreState extends Object {
  private _fileDialog: UseFileDialogReturn = useFileDialog({
    accept: 'text/xml'
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

  public openModel(): Promise<ModelDAO> {
    return new Promise<ModelDAO>((resolve, reject) => {
      this._onLoadFile = async (fileList: FileList | null) => {
        let model: ModelDAO | null = null
        if (fileList) {
          for (const file of fileList) {
            const text = await file.text()
            try {
              model = services.xmlConverter.importXML(text)
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
}

const store: Store<StoreState> = createStore({
  state(): StoreState {
    return new StoreState()
  },
  getters: {
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
    }
  },
  mutations: {
    addNewModel(state: StoreState) {
      state.modelService.newModel()
    },
    removeModel(state: StoreState, model: ModelDAO) {
      state.modelService.removeModel(model)
    }
  },
  actions: {
    openModel(context): Promise<ModelDAO> {
      return context.state.openModel()
    }
  }
})

export default store
