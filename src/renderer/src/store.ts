import { useTheme } from 'vuetify/lib/framework.mjs'
import { Store, createStore } from 'vuex'
import { ModelDAO } from './dao/ModelDAO'
import { services } from './services/Manager'
import { ModelService } from './services/ModelService'

class StoreState extends Object {
  public get modelService(): ModelService {
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
