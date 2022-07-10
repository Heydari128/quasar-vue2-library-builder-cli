<template>
  <div class="text-field flex no-wrap items-center q-gutter-x-md" :class="{'q-mb-md':margin}">
    <label :style="{minWidth: labelWidth}" :htmlFor="compId">{{ label }}</label>
    <div :class="`${$q.dark.isActive?'bg-red': 'bg-blue'}`">
      <q-input dense label="" outlined :id="compId" :value="internalValue"
               :type="type" @input="updateValue"/>
    </div>
  </div>
</template>

<script>
import {uid} from 'quasar'

export default {
  name: "TextField",
  inheritAttrs: false,
  props: {
    value: [String, Number],
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    margin: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '70px'
    },
  },
  data() {
    return {
      compId: uid(),
      internalValue: ''
    }
  },
  methods: {
    updateValue(value) {
      console.log('valuee', value)
      this.$emit('input', value)
    }
  },
  watch: {
    value: {
      handler() {
        this.internalValue = this.value
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">

</style>
