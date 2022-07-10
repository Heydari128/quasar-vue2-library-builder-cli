const path = require('path')
const {readFile} = require('./fs-helper')

module.exports = function QuasarResolver() {
    const allQuasarComponents = JSON.parse(readFile(path.resolve(__dirname, './quasar.json')))
    return {
        type: 'component',
        resolve: async (name) => {
            console.log(name, allQuasarComponents[name])
            if (allQuasarComponents[name]) {
                return {name: allQuasarComponents[name], from: 'quasar'}
            }
        }
    }
}
