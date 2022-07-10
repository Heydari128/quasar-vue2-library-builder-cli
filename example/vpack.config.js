const path = require("path");

module.exports = {
  entry: './src/main.js',
  output: {
    dir: 'dist',
    name: 'ui-framework',
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
