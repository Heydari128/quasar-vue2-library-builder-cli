import * as components from './components'

export default {
  ...components,
  install(Vue, options) {

    Object.entries(components).forEach(([name, component]) => {
      Vue.component(name, component)
    })

    console.log('library installed successfully...')

    return Vue
  }
}
