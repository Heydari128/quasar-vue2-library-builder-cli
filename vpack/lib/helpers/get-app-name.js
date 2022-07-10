const getPkg = require('./get-app-package-json')
module.exports = function () {
    try {
        return getPkg().name
    } catch (e) {
    }
}
