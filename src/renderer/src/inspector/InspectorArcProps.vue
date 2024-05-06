<script setup lang="ts">
import { Arc } from '@renderer/entity/impl/Arc'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import ArcFunctionEdit from '@renderer/edits/ArcFunctionEdit.vue'
import ArcColorSelect from '@renderer/selects/ArcColorSelect.vue'
import { Color } from '@renderer/core/Color'
import { Weight } from '@renderer/core/Weight'

defineProps<{
  dao: ModelDAO
  arc: Arc
}>()
</script>

<template>
  <!-- Color -->
  <ArcColorSelect :arc="arc" v-model:color="<Color | undefined>color" :dao="dao"></ArcColorSelect>

  <!-- Function visualization -->
  <vue-mathjax class="d-flex justify-center" :formula="'`' + getFormula() + '`'" />

  <!-- Function -->
  <ArcFunctionEdit
    class="mt-4"
    :arc="arc"
    :color="<Color | undefined>color"
    :dao="dao"
  ></ArcFunctionEdit>
</template>

<script lang="ts">
export default {
  data() {
    return {
      color: undefined as Color | undefined
    }
  },
  methods: {
    getFormula(): string {
      if (!this.color) {
        return '1'
      }

      const weight: Weight | undefined = this.arc.getWeight(this.color as Color)
      if (!weight) {
        return '1'
      }

      return weight.function.formatString(true)
    }
  }
}
</script>

<style lang="scss"></style>
