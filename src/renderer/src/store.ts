import { useTheme } from 'vuetify/lib/framework.mjs'
import { Store, createStore } from 'vuex'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { services } from '@renderer/services'
import { IModelService } from '@renderer/services/intf/IModelService'

class StoreState extends Object {
  public get modelService(): IModelService {
    return services.modelService
  }

  public applyTheme(theme: string): void {
    useTheme().global.name.value = theme
  }
}

const store: Store<StoreState> = createStore({
  state(): StoreState {
    return new StoreState()
  },
  getters: {
    getTheme: (): string => {
      return useTheme().global.name.value
    },
    getModels: (state: StoreState): Array<ModelDAO> => {
      return state.modelService.models
    }
  },
  mutations: {
    applyDarkMode(state: StoreState) {
      state.applyTheme('dark')
    },
    applyLightMode(state: StoreState) {
      state.applyTheme('light')
    },
    addNewModel(state: StoreState) {
      state.modelService.newModel()
    },
    removeModel(state: StoreState, model: ModelDAO) {
      state.modelService.removeModel(model)
    }
  }
})

export default store
