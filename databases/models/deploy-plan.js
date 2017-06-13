let db = require('../../databases')('deploy-plan')

let nodeSchema = db.Schema({
  ID: String,
  Node: String,
  Address: String,
  Datacenter: String
})

let schema = db.Schema({
  number: String,
  status: String,
  successful: String,
  running: String,
  pipelineId: String,
  stageId: String,
  revisionId: String,
  inputId: String,
  nodes: [nodeSchema],
  metadata: {
    createdAt: Date,
    updatedAt: Date
  }
})

module.exports = db.model('Plan', schema)
