let db = require('../../databases')('approval')

let schema = db.Schema({
  inputRev: String,
  artifactId: String,
  jobId: String,
  jobName: String,
  stageId: String,
  stageName: String,
  pipelineId: String,
  pipelineName: String,
  toolchainId: String,
  toolchainName: String,
  status: String,
  metadata: {
    createdAt: Date,
    updatedAt: Date
  }
})

module.exports = db.model('Approval', schema)
