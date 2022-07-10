// const path = require("path")
// const {log} = require("../lib/helpers/logger")
const getConfig = require('../lib/helpers/get-config')
const parseArgs = require("minimist")

const argv = parseArgs(process.argv.slice(2), {
    alias: {
        c: 'config',
        e: 'entry',
        o: 'output',
        n: 'name',
        f: 'formats'
    },
    string: ['c', 'e', 'o', 'n', 'f'],
    default: {
        c: 'vpack.config.js',
    }
})

const config = getConfig(argv)
console.log(config)