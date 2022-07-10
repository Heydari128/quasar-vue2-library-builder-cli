import * as components from './components'

export default {
  async install(Vue, options) {

    Object.entries(components).forEach(([name, component]) => {
      Vue.component(name, component)
      console.log(name, component)
    })

    console.log('library installed successfully...')

    return Vue
  }
}
