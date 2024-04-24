import { useTheme } from 'vuetify/lib/framework.mjs'
import { UseFileDialogReturn, useFileDialog } from '@vueuse/core'
import { Store, createStore } from 'vuex'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { services } from '@renderer/services'
import { IModelService } from '@renderer/services/intf/IModelService'

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

  public applyTheme(theme: string) {
    useTheme().global.name.value = theme
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
    getModels: (state: StoreState): Array<ModelDAO> => {
      return state.modelService.models
    },
    getTheme: (): string => {
      return useTheme().global.name.value
    }
  },
  mutations: {
    addNewModel(state: StoreState) {
      state.modelService.newModel()
    },
    applyDarkMode(state: StoreState) {
      state.applyTheme('dark')
    },
    applyLightMode(state: StoreState) {
      state.applyTheme('light')
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
