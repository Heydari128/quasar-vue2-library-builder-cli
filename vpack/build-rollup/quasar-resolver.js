const _fs = require('fs')
const _localpkg = require('local-pkg')
const path = require('path')

module.exports = function QuasarResolver() {
  let components5 = {}
  if (!components5.length) {
    const quasarApiListPath = _localpkg.resolveModule.call(void 0, path.resolve(__dirname, './quasar.json'))
    if (quasarApiListPath) {
      components5 = JSON.parse(_fs.readFileSync(quasarApiListPath, 'utf-8'))
    }
  }
  // console.log('components5', components5)

  return {
    type: 'component',
    resolve: async (name) => {

      if (components5[name]) {
        // console.log(name, components5[name])
        return {name: components5[name], from: 'quasar'}
      }
    }
  }
}
