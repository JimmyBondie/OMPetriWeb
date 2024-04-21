<script setup lang="ts"></script>

<template>
  <v-row no-gutters>
    <v-col cols="9"> </v-col>

    <v-col cols="3">
      <v-expansion-panels multiple variant="accordion">
        <v-expansion-panel :title="$t('Model')"></v-expansion-panel>
        <v-expansion-panel :title="$t('Tools')"></v-expansion-panel>
        <v-expansion-panel :title="$t('QuickView')"></v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts"></script>

<style lang="scss"></style>
