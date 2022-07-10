const path = require("path");
const {log} = require("./logger");
const merge = require('merge-deep');
const getPkgFile = require('../helpers/get-app-package-json')
module.exports = (cliArgs) => {
    const configPath = path.resolve(process.cwd(), cliArgs.config)
    log(`Looking for config file at this location: ${configPath}`)

    const argOutput = cliArgs.output
    const argEntry = cliArgs.entry
    const argName = cliArgs.name
    const argFormats = cliArgs.formats

    let defaultConfig = {
        entry: 'index.js',
        output: {
            dir: 'dist',
            name: 'yourpackage',
            formats: ['es'], // 'es', 'cjs', 'umd'
            minified: true,
            sourceMap: false,
            clean: true,
            minExt: false,
        },
        resolver: {
            extensions: ['.vue', '.js', '.json', '.sass', '.scss']
        },
        alias: {
            'src': './src',
            'components': './src/components',
        },
        statics: {
            // 'public': 'dist/statics'
        },
        env: 'production'
    }
    const configFile = require(configPath)
    const config = merge(defaultConfig, configFile)
    if (argEntry) config.entry = argEntry
    if (argOutput) config.output.dir = argOutput
    if (argName) config.output.name = argName
    if (argFormats) config.output.formats = argFormats.split(',')

    config.pkg = getPkgFile()
    config.parallel = require('os').cpus().length > 1

    return config
}