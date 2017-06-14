var request = require('request-promise')

const DEVOPS_API = 'https://devops-api.ng.bluemix.net'
const PIPELINE_API = `${DEVOPS_API}/v1/pipeline/pipelines`
const AUTH = process.env.AUTH

exports.runStage = function (pipelineId, stageId, data) {
  const options = {
    uri: `${PIPELINE_API}/${pipelineId}/stages/${stageId}/executions`,
    method: 'POST',
    headers: {
      Authorization: AUTH
    },
    json: {
      input: [data]
    }
  }
  return request(options)
}

exports.getInputs = function (pipelineId, stageId) {
  const options = {
    uri: `${PIPELINE_API}/${pipelineId}/stages/${stageId}/inputs`,
    method: 'GET',
    json: true,
    headers: {
      Authorization: AUTH
    }
  }
  return request(options)
}

exports.getExecutionsByArtifactId = function (pipelineId, stageId, artifactId) {
  const options = {
    uri: `${PIPELINE_API}/${pipelineId}/stages/${stageId}/executions?jobExecutionId=${artifactId}`,
    method: 'GET',
    json: true,
    headers: {
      Authorization: AUTH
    }
  }
  return request(options)
}
