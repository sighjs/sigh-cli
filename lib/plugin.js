var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn

var Promise = require('bluebird')
var ensureDir = Promise.promisify(require('ensureDir'))

var dataHome = require('xdg').basedir.dataPath('sigh-cli/plugin')

function run(cmd) {
  return new Promise(function(resolve, reject) {
    cmd = cmd.split(' ')
    var proc = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' })
    proc.on('close', function(code) {
      if (code === 0)
        resolve(code)
      else
        reject(code)
    })
  })
}


exports.create = function(pluginName) {
  pluginName = pluginName.replace(/^sigh-/, '')
  console.log('Create plugin ' + pluginName)

  var cwd = process.cwd()
  var pluginDir = path.join(cwd, 'sigh-' + pluginName)
  var yoPath = path.join(dataHome, 'node_modules/.bin/yo')

  return ensureDir(dataHome)
  .then(function() {
    process.chdir(dataHome)

    if (! fs.existsSync(yoPath)) {
      console.log('Installing yeoman, please wait, this will not be necessary on future runs.')
      return run('npm install yo')
    }
  })
  .then(function() {
    if (! fs.existsSync('node_modules/generator-sigh-plugin')) {
      console.log('Installing yeoman generator for sigh-plugin, please wait.')
      return run('npm install generator-sigh-plugin')
    }
  })
  .then(function() {
    return ensureDir(pluginDir)
  })
  .then(function() {
    process.chdir(pluginDir)
    return run(yoPath + ' sigh-plugin')
  })
}
