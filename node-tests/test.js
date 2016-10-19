const fs = require('fs-extra')
const exec = require('child_process').exec
const path = require('path')
const expect = require('chai').expect

const FAILING_FILE = path.join(__dirname, '/../tests/dummy/app/unused.js')

describe('ember-cli-Standard', function () {
  this.timeout(60000)

  afterEach(function () {
    fs.removeSync(FAILING_FILE)
  })

  it('passes if Standard tests pass', function () {
    return emberTest().then(function (result) {
      console.log(result)
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

  it('fails if a Standard tests fails', function () {
    fs.outputFileSync(FAILING_FILE, 'let unused = 6;\n')

    return emberTest().then(function (result) {
      expect(result.error).to.exist
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
})

function emberTest () {
  return new Promise(function (resolve) {
    exec('node_modules/.bin/ember test', { cwd: __dirname + '/..' }, function (error, stdout, stderr) {
      resolve({
        error: error,
        stdout: stdout,
        stderr: stderr
      })
    })
  })
}
