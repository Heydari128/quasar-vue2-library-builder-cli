const {bold, blue, yellow, green} = require("chalk");

console.log()
console.log(require('fs').readFileSync(
    require('path').join(__dirname, '../assets/logo.art'),
    'utf8'))
console.log()

let banner = ''
banner += `${bold(green('You are using Quasar Vue2 Library Builder.'))} => ${yellow('vpack')}\n`
banner += `===================================================\n`
banner += `Commands:\n`
banner += `  build, b            Build your package\n`
banner += `  config, c           Set vpack config file (default: vpack.config.js)\n`
banner += `  entry, e            Set entry file (default: index.js) \n`
banner += `  output, o           Set output directory (default: dist) \n`
banner += `  name, n             Set output file name (default: your package.json name) \n`
banner += `  formats, f          Set output file's format(s) (default: es,umd) \n`
banner += `  help, h             Display this message\n`
banner += `  create-config, cc   Create sample vpack.config.js in your project\n`

banner += `===================================================\n`
banner += `Usage:\n`
banner += `  $ vpack build\n`
banner += `  $ vpack build --c ./myvpack.config.js\n`
banner += `  $ vpack build --entry ./src/main.js\n`
banner += `  $ vpack create-config\n`
banner += `  $ vpack build --o dist2\n`
banner += `  $ vpack build --o dist2 --e ./src/main.js\n`
banner += `  $ vpack build -o dist2 -e src/main.js -n myapp -f es,umd\n`

banner += '\n'
banner += blue(`To start using please run build command.\n`)

console.log(banner)