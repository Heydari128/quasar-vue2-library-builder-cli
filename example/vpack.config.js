module.exports = {
  entry: './src/main.js',
  output: {
    dir: 'dist',
    name: 'ui-framework',
    formats: ['es'], // 'es', 'cjs', 'umd'
    minified: true,
    clean: true,
    sourceMap: false,
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
