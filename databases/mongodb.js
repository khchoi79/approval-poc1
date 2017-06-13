var log = require('../utils/logger')('mongoose')

module.exports = function (url, dbName) {
  let mongoose = require('mongoose')

  // temp workaround for mongoose and Compose for MongoDB
  if (url.indexOf('dblayer.com') > 0 && url.indexOf(',') > 0) {
    url = url.replace(/,.*\//, '/')
  }

  mongoose.connect(url)
  .then(res => log.info('Database connected'))
  .catch(err => log.error('Failed to connect database', err))
  return mongoose
}
