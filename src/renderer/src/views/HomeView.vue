<script setup lang="ts">
import SimulationPage from '@renderer/components/SimulationPage.vue'
import About from '../components/About.vue'
import Overview from '../components/Overview.vue'
import Settings from '../components/Settings.vue'
import { TourGuideClient } from '@sjmc11/tourguidejs/src/Tour'
import { mapGetters } from 'vuex'
</script>

<template>
  <main class="h-100">
    <v-app-bar style="position: unset" density="comfortable" color="blue">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="menuOpen = !menuOpen"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>OMPetriWeb</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="menuOpen"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
    >
      <v-list v-model:selected="selectedTab" nav mandatory>
        <v-list-item
          :data-tg-tour="$t('OverviewDescription')"
          :data-tg-title="$t('Overview')"
          data-tg-order="1"
          prepend-icon="mdi-graph-outline"
          value="overview"
          ref="overviewBtn"
        >
          {{ $t('Overview') }}
        </v-list-item>
        <v-list-item
          :data-tg-tour="$t('SimulationsDescription')"
          :data-tg-title="$t('Simulations')"
          data-tg-order="4"
          prepend-icon="mdi-calculator-variant-outline"
          value="simulations"
        >
          {{ $t('Simulations') }}
        </v-list-item>
        <v-list-item
          :data-tg-tour="$t('SettingsDescription')"
          :data-tg-title="$t('Settings')"
          data-tg-order="5"
          prepend-icon="mdi-cog-outline"
          value="settings"
        >
          {{ $t('Settings') }}
        </v-list-item>
        <v-list-item
          :data-tg-tour="$t('AboutDescription')"
          :data-tg-title="$t('About')"
          data-tg-order="8"
          prepend-icon="mdi-information-outline"
          value="about"
        >
          {{ $t('About') }}
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-btn
          v-if="isInitialStart"
          color="warning"
          prepend-icon="mdi-help-circle-outline"
          append-icon="mdi-help-circle-outline"
          block
          rounded="0"
          @click="(<TourGuideClient>getTour).start()"
        >
          {{ $t('NeedHelp') }}
        </v-btn>
      </template>
    </v-navigation-drawer>

    <v-main style="height: calc(100% - var(--app-bar-height))">
      <v-window v-model="selectedTab[0]" direction="vertical" class="h-100">
        <!-- Overview -->
        <v-window-item value="overview" class="h-100">
          <Overview class="h-100"></Overview>
        </v-window-item>

        <v-window-item value="simulations" class="h-100">
          <SimulationPage class="h-100"></SimulationPage>
        </v-window-item>

        <!-- Settings -->
        <v-window-item value="settings" class="h-100">
          <Settings class="h-100"></Settings>
        </v-window-item>

        <!-- About -->
        <v-window-item value="about" class="h-100 overflow-auto">
          <About></About>
        </v-window-item>
      </v-window>
    </v-main>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      menuOpen: true,
      selectedTab: [] as Array<string>
    }
  },
  computed: {
    ...mapGetters(['isInitialStart', 'getTour'])
  },
  mounted() {
    ;(this.getTour as TourGuideClient).onBeforeStepChange(() => {
      switch (this.getTour.activeStep) {
        case 0:
        case 7: {
          this.selectedTab[0] = 'overview'
          break
        }

        case 4: {
          this.selectedTab[0] = 'settings'
          break
        }
      }
      window.setTimeout(() => (this.getTour as TourGuideClient).updatePositions(), 500)
    })
  }
}
</script>

<style lang="scss">
@import '@sjmc11/tourguidejs/src/scss/tour.scss';

.v-navigation-drawer {
  z-index: 2004 !important;
}

.v-navigation-drawer__scrim {
  z-index: 2003 !important;
}

.v-navigation-drawer--left {
  top: calc(var(--app-bar-height) + var(--toolbar-height)) !important;
  height: calc(100% - var(--app-bar-height) - var(--toolbar-height)) !important;
}

.v-main {
  --v-layout-top: 0px !important ;
}

.tg-backdrop {
  z-index: 2005;
  opacity: var(--v-overlay-opacity, 0.7);
}

.tg-dialog {
  z-index: 2005 !important;
  background-color: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  .tg-dialog-close-btn {
    fill: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }
  .tg-dialog-btn {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity)) !important;
    border: thin solid currentColor !important;
  }
  .tg-step-progress {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  }
}
</style>
