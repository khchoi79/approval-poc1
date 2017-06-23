let db = require('../../databases')('approval')
let inputSchema = require('./input-schema')

let revisionSchema = db.Schema({
  id: String,
  message: String,
  number: Number,
  timestamp: Number,
  url: String,
  userEmail: String,
  userId: String,
  userName: String
})

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
  approvers: [String],
  status: String,
  inputs: [inputSchema],
  scmInputs: [inputSchema],
  revisionId: String,
  inputRevision: revisionSchema,
  scmUrl: String,
  metadata: {
    createdAt: Date,
    updatedAt: Date
  }
})

module.exports = db.model('Approval', schema)
