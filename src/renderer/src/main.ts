import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueMathjax from 'vue-mathjax-next'

// Vue-I18n
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
const i18n = createI18n({
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: {
    en: en,
    de: de
  }
})

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VNumberInput } from 'vuetify/lib/labs/components.mjs'
const vuetify = createVuetify({
  components: {
    ...components,
    VNumberInput
  },
  defaults: {
    VSelect: {
      closeText: i18n.global.t('Close'),
      noDataText: i18n.global.t('NoDataAvailable'),
      openText: i18n.global.t('Open')
    }
  },
  directives
})

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

// Vue Store
import store from './store'

const app = createApp(App)
app.use(i18n)
app.use(router)
app.use(vuetify)
app.use(store)
app.use(VueMathjax)
app.mount('#app')

export default i18n
