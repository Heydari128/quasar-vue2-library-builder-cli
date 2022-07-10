<template>
  <div class="text-field flex no-wrap items-center q-gutter-x-md" :class="{'q-mb-md':margin}">
    <label :style="{minWidth: labelWidth}" :htmlFor="compId">{{ label }}</label>
    <div>
      <q-input dense label="" v-bind="$attrs" v-on="$listeners" outlined :id="compId" :value="internalValue"
               :type="type" @input="$emit('input', $event)"/>
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
