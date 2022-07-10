// const path = require("path")
// const {log} = require("../lib/helpers/logger")
const getConfig = require('../lib/helpers/get-config')
const parseArgs = require("minimist")
const {log} = require("../lib/helpers/logger");
const {createFolder, writeFile, readFile} = require('../lib/helpers/fs-helper')
const copyright = require('../lib/copyright')
const getAppPaths = require('../lib/helpers/app-paths')
const path = require('path')
// rollup
const vueRollup = require('rollup-plugin-vue2')
const rollup = require('rollup')
const {uglify} = require("rollup-plugin-uglify")
const resolve = require('@rollup/plugin-node-resolve').default
const Components = require('unplugin-vue-components/rollup')
const postcss = require('rollup-plugin-postcss')
const json = require('@rollup/plugin-json')
const commonJs = require('@rollup/plugin-commonjs')
const {terser} = require('rollup-plugin-terser')
const alias = require('rollup-plugin-alias')

const quasarTypes = Object.keys(JSON.parse(readFile(path.resolve(__dirname, '../lib/helpers/quasar.json')))).filter(x => x.indexOf('-') === -1)
const argv = parseArgs(process.argv.slice(2), {
    alias: {
        c: 'config', e: 'entry', o: 'output', n: 'name', f: 'formats'
    },
    string: ['c', 'e', 'o', 'n', 'f'],
    default: {
        c: 'vpack.config.js',
    }
})

const config = getConfig(argv)
process.env.NODE_ENV = config.env

log(`Building ${config.pkg.name} ${'v' + config.pkg.version}...${config.parallel ? ' [multi-threaded]' : ''}`)

// ensure exist "output.dir" directory
createFolder(config.output.dir, process.cwd())
// clean dist
if (config.output.clean) require('../scripts/script.clean')(config)
// copy statics files
if (config.statics) require('../scripts/script.statics')(config)

// build library
const customResolver = resolve({
    extensions: config.resolver.extensions
});

let rollupPlugins = [
    resolve({
        extensions: config.resolver.extensions
    }),
    alias({
        entries: Object.entries(config.alias).map(([find, replacement]) => ({
            find: find,
            replacement: getAppPaths(replacement)
        })),
        customResolver
    }),
    resolve(),
    json(),
    Components({
        extensions: ['vue', 'js'],
        transformer: 'vue2',
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/,],
        dts: getAppPaths('./components.d.ts'),
        resolvers: [
            require('../lib/helpers/quasar-resolver.js')(),
            (componentName) => {
                console.log(componentName)
                // where `componentName` is always CapitalCase
                if (componentName.startsWith('Van'))
                    return { name: componentName.slice(3), from: 'vant' }
            },
        ],
        types: [{
            names: quasarTypes,
            from: 'quasar'
        }]
    }),
    postcss({
        plugins: [require('autoprefixer')],
        inject: true,
        // hold css Put it in and js Same directory
        // extract: true,
        minimize: config.output.minified,
        sourceMap: config.output.sourceMap,
        extensions: ['.sass', '.scss', '.less', '.css']
    }),
    vueRollup({
        css: false,
        compileTemplate: false,
        target: 'browser',
        preprocessStyles: false,
    }),
    commonJs(),
]
if (config.output.minified) {
    rollupPlugins.push(uglify({}))
    rollupPlugins.push(terser())
}
let outputs = []
config.output.formats.forEach(format => {
    outputs.push({
        rollup: {
            input: {
                input: getAppPaths(config.entry)
            },
            output: {
                name: config.output.name,
                dir: path.resolve(__dirname, process.cwd(), config.output.dir) + `\\${config.output.name}.${format}.js`,
                format,
                exports: "named",
                globals: {vue: "Vue", quasar: "quasar"},
            }
        },
        build: {
            unminified: config.output.unminified,
            minified: config.output.minified,
            minExt: config.output.minExt
        }
    })
})

// building...

function genConfig(opts) {
    Object.assign(opts.rollup.input, {
        plugins: rollupPlugins,
        external: ['vue', 'quasar']
    })

    Object.assign(opts.rollup.output, {
        banner: copyright.banner,
        globals: {vue: 'Vue', quasar: 'Quasar'}
    })

    return opts
}

function injectVueRequirement(code) {
    // eslint-disable-next-line
    const index = code.indexOf(`Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue`)

    if (index === -1) {
        return code
    }

    const checkMe = ` if (Vue === void 0) {
    console.error('[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.')
    return
  }
  `

    return code.substring(0, index - 1) +
        checkMe +
        code.substring(index)
}

function addExtension(filename, ext = 'min') {
    const insertionPoint = filename.lastIndexOf('.')
    return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`
}

function buildEntry(buildConfig) {
    return rollup
        .rollup(buildConfig.rollup.input)
        .then(bundle => bundle.generate(buildConfig.rollup.output))
        .then(({output}) => {
            const code = buildConfig.rollup.output.format === 'umd'
                ? injectVueRequirement(output[0].code)
                : output[0].code

            return buildConfig.build.unminified
                ? writeFile(buildConfig.rollup.output.dir, code)
                : code
        })
        .then(code => {
            if (!buildConfig.build.minified) {
                return code
            }

            // const minified = uglify.minify(code, {
            //   compress: {
            //     pure_funcs: ['makeMap']
            //   }
            // })
            //
            // if (minified.error) {
            //   return Promise.reject(minified.error)
            // }
            const minified = {
                error: null,
                code
            }

            return writeFile(
                buildConfig.build.minExt === true
                    ? addExtension(buildConfig.rollup.output.dir)
                    : buildConfig.rollup.output.dir,
                copyright.banner + minified.code,
                true
            )
        })
        .catch(err => {
            console.error(err)
            process.exit(1)
        })
}

outputs.map(genConfig).map(buildEntry)

// console.log()
// console.log(copyright.banner)
// console.log(buildConfig)