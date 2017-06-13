let db = require('../../databases')('service-map')

let schema = db.Schema({
  serviceName: String,
  pipelineId: String,
  stageId: String,
  inputId: String,
  metadata: {
    createdAt: Date,
    updatedAt: Date
  }
})

module.exports = db.model('Service', schema)
