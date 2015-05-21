var path = require('path')

var Promise = require('bluebird')
var ensureDir = Promise.promisify(require('ensureDir'))

exports.create = function(pluginName) {
  pluginName = pluginName.replace(/^sigh-/, '')
  console.log('Create plugin ' + pluginName)

  var env = require('yeoman-environment').createEnv()
  env.register(require.resolve('generator-sigh-plugin/generators/app'))

  var cwd = process.cwd()
  var pluginDir = path.join(cwd, 'sigh-' + pluginName)

  return ensureDir(pluginDir)
  .then(function() {
    process.chdir(pluginDir)
    return new Promise(function(resolve, reject) {
      env.run('sigh-plugin', function (err) {
        if (err)
          reject()
        else
          resolve()
      })
    })
  })
}
