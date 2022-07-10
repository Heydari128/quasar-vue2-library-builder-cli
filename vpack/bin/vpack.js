#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const parseArgs = require('minimist')
const {log} = require("../lib/helpers/logger");
const getAppName = require('../lib/helpers/get-app-name')
const argv = parseArgs(process.argv.slice(2), {
    _: ['help', 'build', 'create-config'],
    alias: {
        c: 'config',
        h: 'help',
        b: 'build',
        cc: 'create-config',
    },
    string: ['c'],
    boolean: ['h', 'help', 'b', 'build', 'cc', 'create-config'],
    default: {
        c: 'vpack.config.js',
    }
})

const build = argv._.includes('build') || argv.build
const help = argv._.includes('help') || argv.help
const createConfig = argv._.includes('create-config') || argv.cc

if (createConfig) {
    const rootPkgName = getAppName()
    let sampleConfig = fs.readFileSync(path.join(__dirname, '../lib/sample.config'), 'utf8')
    sampleConfig = sampleConfig.replace(/##yourpackage##/g, rootPkgName)
    fs.writeFileSync(path.resolve(process.cwd(), argv.config), sampleConfig, {encoding: 'utf8', flag: 'w'})
    log('config file successfully generated.')
} else if (help || !build) {
    require('./vpack-help')
} else {
    require('./vpack-build')
}