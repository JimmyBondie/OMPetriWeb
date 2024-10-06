<script setup lang="ts">
import { TourGuideClient } from '@sjmc11/tourguidejs'
import { useLocale, useTheme } from 'vuetify/lib/framework.mjs'
import { mapGetters, mapMutations } from 'vuex'
</script>

<template>
  <v-card :title="$t('Settings')" class="w-100" rounded="0">
    <v-list>
      <v-list-subheader>{{ $t('General') }}</v-list-subheader>

      <!-- Language -->
      <v-list-item
        :data-tg-tour="$t('LanguageDescription')"
        :data-tg-title="$t('Language')"
        data-tg-order="6"
      >
        <v-list-item-title>{{ $t('Language') }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-select
            v-model="language"
            :items="languageItems"
            item-title="name"
            item-value="code"
            density="compact"
            max-width="300px"
            hide-details
          ></v-select>
        </v-list-item-subtitle>
      </v-list-item>

      <!-- Theme -->
      <v-list-item
        :data-tg-tour="$t('DesignDescription')"
        :data-tg-title="$t('Design')"
        data-tg-order="7"
      >
        <v-list-item-title>{{ $t('Design') }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-btn
            v-if="theme == themeDark"
            @click="() => (theme = themeLight)"
            prepend-icon="mdi-weather-sunny"
            variant="tonal"
          >
            {{ $t('Light') }}
          </v-btn>
          <v-btn
            v-if="theme != themeDark"
            @click="() => (theme = themeDark)"
            prepend-icon="mdi-weather-night"
            variant="tonal"
          >
            {{ $t('Dark') }}
          </v-btn>
        </v-list-item-subtitle>
      </v-list-item>

      <!-- Tutorial -->
      <v-list-item>
        <v-list-item-title>{{ $t('NeedHelp') }}</v-list-item-title>
        <v-list-item-subtitle>
          <v-btn
            color="warning"
            variant="tonal"
            prepend-icon="mdi-help-circle-outline"
            @click="(<TourGuideClient>getTour).start()"
          >
            {{ $t('StartTutorial') }}
          </v-btn>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list select-strategy="classic">
      <v-list-subheader>{{ $t('Graph') }}</v-list-subheader>

      <!-- Show Arc Weights -->
      <v-list-item @click="setShowArcWeights(!getShowArcWeights)">
        <template v-slot:prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              :model-value="getShowArcWeights"
              @update:model-value="(value: boolean) => setShowArcWeights(value)"
            ></v-checkbox-btn>
          </v-list-item-action>
        </template>

        <v-list-item-title>{{ $t('ShowArcWeights') }}</v-list-item-title>
        <v-list-item-subtitle>{{ $t('ShowArcWeightsDescription') }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
export default {
  data() {
    return {
      themeDark: 'dark',
      themeLight: 'light',
      theme: useTheme().global.name,
      language: useLocale().current.value,
      languageItems: [
        {
          name: 'Deutsch',
          code: 'de'
        },
        {
          name: 'English',
          code: 'en'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getShowArcWeights', 'getTour'])
  },
  methods: {
    ...mapMutations(['setLanguage', 'setShowArcWeights', 'setTheme'])
  },
  mounted() {
    const tour: TourGuideClient = this.getTour
    if (tour.isVisible) {
      tour.refresh()
    }
  },
  watch: {
    language() {
      this.$i18n.locale = this.language
      this.setLanguage(this.language)
    },
    theme() {
      this.setTheme(this.theme)
    }
  }
}
</script>

<style lang="scss"></style>
