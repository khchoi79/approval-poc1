let db = require('../../databases')('service-map')
let inputSchema = require('./input-schema')

let schema = db.Schema({
  serviceName: String,
  pipelineId: String,
  stageId: String,
  inputId: String,
  inputs: [inputSchema],
  metadata: {
    createdAt: Date,
    updatedAt: Date
  }
})

module.exports = db.model('Service', schema)
