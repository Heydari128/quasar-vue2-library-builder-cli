const path = require('path')

module.exports = (folder) => {
    return path.resolve(process.cwd(), folder)
}