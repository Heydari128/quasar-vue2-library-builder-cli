const rimraf = require("rimraf");
const path = require("path");
const {success} = require("../lib/helpers/logger");

module.exports = (config) => {
    rimraf.sync(path.resolve(process.cwd(), config.output.dir, '*'))
    success(`Cleaned build artifacts.`)
}