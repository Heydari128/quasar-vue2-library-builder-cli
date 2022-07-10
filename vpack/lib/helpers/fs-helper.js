const
    fs = require('fs'),
    path = require('path'),
    zlib = require('zlib'),
    recursiveCopy = require('recursive-copy')

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}

module.exports.writeFile = function (dest, code, zip) {
    const banner = dest.indexOf('.json') > -1
        ? '[json]'
        : dest.indexOf('.js') > -1
            ? '[js]  '
            : dest.indexOf('.ts') > -1
                ? '[ts]  '
                : '[css] '

    return new Promise((resolve, reject) => {
        function report(extra) {
            console.log(`${banner} ${path.relative(process.cwd(), dest).padEnd(41)} ${getSize(code).padStart(8)}${extra || ''}`)
            resolve(code)
        }

        fs.writeFile(dest, code, err => {
            if (err) return reject(err)
            if (zip) {
                zlib.gzip(code, (err, zipped) => {
                    if (err) return reject(err)
                    report(` (gzipped: ${getSize(zipped).padStart(8)})`)
                })
            } else {
                report()
            }
        })
    })
}

module.exports.readFile = function (file) {
    return fs.readFileSync(file, 'utf-8')
}

module.exports.createFolder = function (folder, root) {
    const dir = path.join(root || __dirname, folder)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

module.exports.copyFolderRecursiveSync = (src, dest, options) => {
    return recursiveCopy(src, dest, options)
}