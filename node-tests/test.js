const expect = require('chai').expect
const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
let generated = false
let count = 0
function getDirectories (srcpath) {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory()
  })
}
const blueprint = function (cmd) {
  let proms = []
  blueprints.forEach((name, i) => {
    if (/standard/.test(name) || (/test/.test(name) && !/acceptance/.test(name))) {
      return
    }
    proms.push(new Promise((resolve, reject) => {
      const command = cmd === 'g' ? 'Generating' : 'Destroying'
      let output = spawn('ember', [cmd, name, `test-thing${i}`])

      output.on('exit', function (code) {
        resolve()
      })
    }))
  })

  return Promise.all(proms).catch((e) => {
    console.log(e)
  })
}
const lint = function (type) {
  return new Promise((resolve, reject) => {
    exec(`standard ./${type}/**/*.js`, { cwd: __dirname + '/..' }, (error, stdout, stderr) => {
      resolve({error, stdout, stderr})
    })
  })
}

const blueprints = getDirectories('blueprints')

const FAILING_FILE = path.join(__dirname, '/../tests/dummy/app/unused.js')

describe('ember-cli-Standard', function () {
  this.timeout(600000)

  afterEach(() => {
    fs.removeSync(FAILING_FILE)
  })

  it('passes if Standard tests pass', () => {
    return emberTest().then((result) => {
      expect(result.error).to.not.exist
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - Standard - app.js: should pass Standard')
        .to.contain('ok 2 PhantomJS 2.1 - Standard - controllers/thing.js: should pass Standard')
        .to.contain('ok 3 PhantomJS 2.1 - Standard - helpers/destroy-app.js: should pass Standard')
        .to.contain('ok 4 PhantomJS 2.1 - Standard - helpers/module-for-acceptance.js: should pass Standard')
        .to.contain('ok 5 PhantomJS 2.1 - Standard - helpers/resolver.js: should pass Standard')
        .to.contain('ok 6 PhantomJS 2.1 - Standard - helpers/start-app.js: should pass Standard')
        .to.contain('ok 7 PhantomJS 2.1 - Standard - models/thing.js: should pass Standard')
        .to.contain('ok 8 PhantomJS 2.1 - Standard - resolver.js: should pass Standard')
        .to.contain('ok 9 PhantomJS 2.1 - Standard - router.js: should pass Standard')
        .to.contain('ok 10 PhantomJS 2.1 - Standard - test-helper.js: should pass Standard')
        .to.not.contain('not ok 11 PhantomJS 2.1 - Standard - unused.js: should pass Standard')
    })
  })

  it('fails if a Standard tests fails', () => {
    fs.outputFileSync(FAILING_FILE, 'let unused = 6;\n')

    return emberTest().then((result) => {
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - Standard - app.js: should pass Standard')
        .to.contain('ok 2 PhantomJS 2.1 - Standard - controllers/thing.js: should pass Standard')
        .to.contain('ok 3 PhantomJS 2.1 - Standard - helpers/destroy-app.js: should pass Standard')
        .to.contain('ok 4 PhantomJS 2.1 - Standard - helpers/module-for-acceptance.js: should pass Standard')
        .to.contain('ok 5 PhantomJS 2.1 - Standard - helpers/resolver.js: should pass Standard')
        .to.contain('ok 6 PhantomJS 2.1 - Standard - helpers/start-app.js: should pass Standard')
        .to.contain('ok 7 PhantomJS 2.1 - Standard - models/thing.js: should pass Standard')
        .to.contain('ok 8 PhantomJS 2.1 - Standard - resolver.js: should pass Standard')
        .to.contain('ok 9 PhantomJS 2.1 - Standard - router.js: should pass Standard')
        .to.contain('ok 10 PhantomJS 2.1 - Standard - test-helper.js: should pass Standard')
        .to.contain('not ok 11 PhantomJS 2.1 - Standard - unused.js: should pass Standard')
    })
  })

  it('All addon blueprints pass standard', () => {
    return blueprint('g').then(() => lint('addon')).then((result) => {
      expect(result.error).to.be.null
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.be.null
    })
  })
  it('All test blueprints pass standard', () => {
    return lint('tests').then((result) => {
      expect(result.error).to.be.null
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.be.null
    }).then(() => blueprint('d'))
  })
})

function emberTest (destroy) {
  return new Promise((resolve) => {
    exec('node_modules/.bin/ember test', { cwd: __dirname + '/..' }, (error, stdout, stderr) => {
      resolve({
        error,
        stdout,
        stderr
      })
    })
  })
}
