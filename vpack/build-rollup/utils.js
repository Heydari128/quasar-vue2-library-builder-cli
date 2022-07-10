const
  fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  kebabRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

module.exports.createFolder = function (folder) {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
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

module.exports.logError = function (err) {
  console.error('\n' + '[Error]', err)
  console.log()
}


module.exports.createFolder = function (folder) {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const copyFileSync = function (source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}
module.exports.copyFileSync = copyFileSync

const copyFolderRecursiveSync = function (source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  let targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      let curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

module.exports.copyFolderRecursiveSync = copyFolderRecursiveSync
