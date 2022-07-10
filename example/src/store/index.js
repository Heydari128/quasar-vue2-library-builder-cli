import Vue from 'vue'
import Vuex from 'vuex'



Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {

  },
  strict: process.env.DEV
})

export default Store

export function getStore () {
  return Store
}
