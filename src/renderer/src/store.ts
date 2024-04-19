import { useTheme } from 'vuetify/lib/framework.mjs'
import { Store, createStore } from 'vuex'

class StoreState {
  public applyTheme(theme: string): void {
    useTheme().global.name.value = theme
  }
}

const store: Store<StoreState> = createStore({
  state(): StoreState {
    return new StoreState()
  },
  getters: {
    getTheme: () => {
      return useTheme().global.name.value
    }
  },
  mutations: {
    applyDarkMode(state: StoreState) {
      state.applyTheme('dark')
    },
    applyLightMode(state: StoreState) {
      state.applyTheme('light')
    }
  }
})

export default store
