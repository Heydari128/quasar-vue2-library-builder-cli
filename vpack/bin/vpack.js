#!/usr/bin/env node

const parseArgs = require('minimist')
const {log, warn} = require('../lib/helpers/logger')
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
        c: 'vbuild.config.js'
    }
})

log(`Looking for config file... (${argv.config})`)