const path = require("path");
const {log} = require("./logger");
const merge = require('merge-deep');
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
            name: '##yourpackage##',
            formats: ['es', 'cjs', 'umd'],
            minified: true,
            clean: true
        },
        resolver: {
            extensions: ['.vue', '.js', '.json', '.sass', '.scss']
        },
        alias: {
            'src': path.resolve(__dirname, './src'),
            'components': path.resolve(__dirname, './src/components'),
        }
    }
    const configFile = require(configPath)
    const finalConfig = merge(defaultConfig, configFile)
    if (argEntry) finalConfig.entry = argEntry
    if (argOutput) finalConfig.output.dir = argOutput
    if (argName) finalConfig.output.name = argName
    if (argFormats) finalConfig.output.formats = argFormats.split(',')

    return finalConfig
}