const path = require('path')
const vueRollup = require('rollup-plugin-vue2')
const fs = require('fs')
const buble = require('@rollup/plugin-buble')
const rollup = require('rollup')
const {uglify} = require("rollup-plugin-uglify")
const resolve = require('@rollup/plugin-node-resolve').default
const unplugin = require('unplugin-vue-components/rollup')
const postcss = require('rollup-plugin-postcss')
const json = require('@rollup/plugin-json')
const babel = require('rollup-plugin-babel')
const commonJs = require('@rollup/plugin-commonjs')
const {terser} = require('rollup-plugin-terser')
const alias = require('rollup-plugin-alias')
const {version} = require('../package.json')

const quasarTypes = Object.keys(JSON.parse(fs.readFileSync(path.resolve(__dirname, './quasar.json'), 'utf-8'))).filter(x => x.indexOf('-') === -1)

const buildConf = require('./config')
const buildUtils = require('./utils')
const QuasarResolver = require("./quasar-resolver");
const customResolver = resolve({
  extensions: ['.vue', '.js', '.json', '.sass', '.scss']
});
const projectRootDir = path.resolve(__dirname);

const rollupPlugins = [
  resolve({
    extensions: ['.vue', '.js', '.json', '.sass', '.scss']
  }),
  alias({
    'src': path.resolve(__dirname, '../src'),
    'components': path.resolve(__dirname, '../src/components'),
  }),
  alias({
    entries: [
      {
        find: 'src',
        replacement: path.resolve(projectRootDir, 'src')
      }
    ],
    customResolver
  }),
  resolve(),
  json(),
  uglify({}),
  unplugin({
    extensions: ['vue', 'js'],
    transformer: 'vue2',
    // allow auto import and register components used in markdown
    include: [/\.vue$/, /\.vue\?vue/,],
    dts: './components.d.ts',
    resolvers: [
      QuasarResolver()
    ],
    // types: []
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
    minimize: true,
    sourceMap: false,
    extensions: ['.sass', '.scss', '.less', '.css']
  }),
  vueRollup({
    css: false,
    compileTemplate: false,
    target: 'browser',
    preprocessStyles: false,
  }),
  commonJs(),
  // babel({
  //   exclude: 'node_modules/**',
  //   extensions: ['.js', '.vue'],
  //   runtimeHelpers: true
  // }),
  terser()
]

const bubleConfig = {}

const builds = [
  {
    rollup: {
      input: {
        input: pathResolve('../src/main.js')
      },
      output: {
        dir: pathResolve('../dist/kais-security.es.js'),
        format: 'es',
        exports: "named",
        globals: {vue: "Vue", quasar: "quasar"},
        name: 'kais-security'
      },
    },
    build: {
      // unminified: true,
      minified: true
    }
  },
  {
    rollup: {
      input: {
        input: pathResolve('../src/main.js')
      },
      output: {
        dir: pathResolve('../dist/kais-security.common.js'),
        format: 'cjs',
        exports: "named",
        globals: {vue: "Vue", quasar: "quasar"},
        name: 'kais-security',
      }
    },
    build: {
      // unminified: true,
      minified: true
    }
  },
  /*  {
      rollup: {
        input: {
          input: pathResolve('../src/main.js')
        },
        output: {
          name: 'kais-security',
          dir: pathResolve('../dist/kais-security.umd.js'),
          format: 'umd',
          exports: "named",
          globals: {vue: "Vue", quasar: "quasar"},
        }
      },
      build: {
        unminified: false,
        minified: true,
        minExt: true
      }
    }*/
]

// Add your asset folders here, if needed
// addAssets(builds, 'icon-set', 'iconSet')
// addAssets(builds, 'lang', 'lang')

build(builds)

/**
 * Helpers
 */

function pathResolve(_path) {
  return path.resolve(__dirname, _path)
}

// eslint-disable-next-line no-unused-vars
function addAssets(builds, type, injectName) {
  const
    files = fs.readdirSync(pathResolve('../src/components/' + type)),
    plugins = [buble(bubleConfig)],
    outputDir = pathResolve(`../dist/${type}`)

  buildUtils.createFolder(outputDir)

  files
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const name = file.substr(0, file.length - 3).replace(/-([a-z])/g, g => g[1].toUpperCase())
      builds.push({
        rollup: {
          input: {
            input: pathResolve(`../src/components/${type}/${file}`),
            plugins
          },
          output: {
            file: addExtension(pathResolve(`../dist/${type}/${file}`), 'umd'),
            format: 'umd',
            name: `kais-security.${injectName}.${name}`
          }
        },
        build: {
          minified: true
        }
      })
    })
}

function build(builds) {
  return Promise
    .all(builds.map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig(opts) {
  Object.assign(opts.rollup.input, {
    plugins: rollupPlugins,
    external: ['vue', 'quasar']
  })

  Object.assign(opts.rollup.output, {
    banner: buildConf.banner,
    globals: {vue: 'Vue', quasar: 'Quasar'}
  })

  return opts
}

function addExtension(filename, ext = 'min') {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`
}

function buildEntry(config) {
  return rollup
    .rollup(config.rollup.input)
    .then(bundle => bundle.generate(config.rollup.output))
    .then(({output}) => {
      const code = config.rollup.output.format === 'umd'
        ? injectVueRequirement(output[0].code)
        : output[0].code

      return config.build.unminified
        ? buildUtils.writeFile(config.rollup.output.dir, code)
        : code
    })
    .then(code => {
      if (!config.build.minified) {
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

      return buildUtils.writeFile(
        config.build.minExt === true
          ? addExtension(config.rollup.output.dir)
          : config.rollup.output.dir,
        buildConf.banner + minified.code,
        true
      )
      return code
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
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
