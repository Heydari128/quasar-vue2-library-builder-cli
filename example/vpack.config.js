module.exports = {
  entry: './src/main.js',
  output: {
    dir: 'dist',
    name: 'ui-framework',
    formats: ['es'], // 'es', 'cjs', 'umd'
    minified: true,
    unminified: false,
    clean: true,
    sourceMap: true,
    minExt: true,
  },
  resolver: {
    extensions: ['.vue', '.js', '.json', '.sass', '.scss']
  },
  alias: {
    'src': './src', // must be relative
    'components': './src/components', // must be relative
  },
   statics: {
       'public': 'dist' // must be relative
   },
   env: 'production'
}
