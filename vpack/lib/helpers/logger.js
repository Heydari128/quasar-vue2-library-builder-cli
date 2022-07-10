const {green, red} = require('chalk')

const banner = 'vpack ·'

const logBanner = green(banner)
const warnBanner = red(banner)

const icons = {
    check: `\u2713`
}
module.exports.icons = icons

module.exports.log = function (msg) {
    console.log(msg ? ` ${logBanner} ${msg}` : '')
}

module.exports.success = function (msg) {
    console.log(green(` ${msg ? `${banner} ${icons.check} ${msg}` : ''}`))
}

module.exports.warn = function (msg) {
    console.warn(msg ? ` ${warnBanner} ⚠️  ${msg}` : '')
}

module.exports.fatal = function (msg) {
    console.error(msg ? ` ${warnBanner} ⚠️  ${msg}` : '')
    process.exit(1)
}
