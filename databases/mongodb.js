var log = require('../utils/logger')('mongoose')

module.exports = function (url, dbName) {
  let mongoose = require('mongoose')

  mongoose.connect(url)
  .then(res => log.info('Database connected'))
  .catch(err => log.error('Failed to connect database', err))
  return mongoose
}
