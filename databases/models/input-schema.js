let db = require('../../databases')('approval')

let scmSourceSchema = db.Schema({
  type: String,
  url: String,
  branch: String
})

let schema = db.Schema({
  type: String,
  id: String,
  jobId: String,
  stageId: String,
  dirName: String,
  scmSource: scmSourceSchema,
  serviceInstanceId: String
})

module.exports = schema
