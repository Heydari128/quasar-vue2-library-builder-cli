module.exports = {
  runtimeCompiler: true,
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "./src/css/quasar.variables.scss";`
      }
    }
  }
}
