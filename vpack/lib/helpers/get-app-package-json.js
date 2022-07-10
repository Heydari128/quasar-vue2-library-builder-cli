const path = require("path");
module.exports = function () {
  try {
    return require(require.resolve(path.resolve(process.cwd(), './package.json')))
  }
  catch (e) {}
}
