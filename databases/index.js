let cfenv = require('cfenv')

let serviceMap = {
  mongodb: {
    name: 'compose-for-mongodb',
    urlField: 'uri'
  }
}

module.exports = function (dbName, dbType) {
  dbType = dbType || 'mongodb'
  let appEnv = cfenv.getAppEnv()
  let credentials = appEnv.services[serviceMap[dbType].name][0].credentials
  let url = credentials[serviceMap[dbType].urlField]
  return require(`./${dbType}`)(url, dbName)
}
