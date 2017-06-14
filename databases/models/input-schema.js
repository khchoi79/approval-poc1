let db = require('../../databases')('approval')

let schema = db.Schema({
  type: String,
  id: String,
  jobId: String,
  stageId: String,
  dirName: String,
  serviceInstanceId: String
})

module.exports = schema
