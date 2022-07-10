const path = require('path')
const sass = require('sass')
const postcss = require('postcss')
const cssnano = require('cssnano')
const rtl = require('rtlcss')
const autoprefixer = require('autoprefixer')
const postCssCompiler = postcss([autoprefixer])
const postCssRtlCompiler = postcss([rtl({})])
const {success, log} = require("../lib/helpers/logger");
const getAppPaths = require('../lib/helpers/app-paths')
const copyright = require('../lib/copyright')
const {writeFile} = require('../lib/helpers/fs-helper')

const nano = postcss([
    cssnano({
        preset: ['default', {
            mergeLonghand: false,
            convertValues: false,
            cssDeclarationSorter: false,
            reduceTransforms: false
        }]
    })
])

module.exports = (config) => {
    log(`compile pre-processor files...`)
    Promise
        .all(config.css.map(src => generate(src, `${config.output.dir}/${config.output.name}`)))
        .catch(e => {
            console.error(e)
            process.exit(1)
        })
}

/**
 * Helpers
 */

function resolve(_path) {
    return getAppPaths(_path)
}

function generate(src, dest) {
    src = resolve(src)
    dest = resolve(dest)
    console.log(src, dest)

    return new Promise((resolve, reject) => {
        sass.render({file: src, includePaths: ['node_modules']}, (err, result) => {
            if (err) {
                reject(err)
                return
            }

            resolve(result.css)
        })
    })
        .then(code => copyright.banner + code)
        .then(code => postCssCompiler.process(code, {from: void 0}))
        .then(code => {
            code.warnings().forEach(warn => {
                console.warn(warn.toString())
            })
            return code.css
        })
        .then(code => Promise.all([
            generateUMD(dest, code),
            postCssRtlCompiler.process(code, {from: void 0})
                .then(code => generateUMD(dest, code.css, '.rtl'))
        ]))
}

function generateUMD(dest, code, ext = '') {
    return writeFile(`${dest}${ext}.css`, code, true)
        .then(code => nano.process(code, {from: void 0}))
        .then(code => writeFile(`${dest}${ext}.min.css`, code.css, true))
}
