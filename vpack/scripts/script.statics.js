const {success, log} = require("../lib/helpers/logger");
const {copyFolderRecursiveSync} = require('../lib/helpers/fs-helper')
const getAppPaths = require('../lib/helpers/app-paths')

module.exports = (config) => {
    log(`copying static files...`)
    Object.entries(config.statics).forEach(([from, to], i) => {
        copyFolderRecursiveSync(getAppPaths(from), getAppPaths(to))
        success(`${i + 1}. copy "${from}/*" to "${to}"`)
    })
}