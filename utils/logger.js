var bunyan = require('bunyan')

module.exports = function (name) {
  let log = bunyan.createLogger({
    name: name,
    level: process.env.LOG_LEVEL || bunyan.info
  })
  return log
}
