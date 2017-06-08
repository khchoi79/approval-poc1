var pipelineClient = require('../utils/pipelineClient')

var inputs = {}
var plan = {}

function addPlan (pipelineId, stageId, data) {
  return new Promise(function (resolve, reject) {
    // Get inputs for the stage
    pipelineClient.getInputs(pipelineId, stageId)
    .then(function (result) {
      if (result.length === 0) {
        reject(new Error('No input for stage'))
      }
      let inputId = result[0].id
      inputs[stageId] = inputId
      data.inputId = inputId
    })
    .then(function () {
      let args = {
        inputId: data.inputId,
        revisionId: data.revisionId
      }
      return pipelineClient.runStage(pipelineId, stageId, args)
    })
    .then(function (result) {
      let detail = Object.assign({}, data)
      detail.number = result.number
      detail.status = result.status
      detail.successful = result.successful
      detail.running = result.running

      if (!plan.hasOwnProperty(stageId)) {
        plan[stageId] = {}
      }
      plan[stageId][result.number] = detail
      resolve(result)
    })
    .catch(function (err) {
      reject(err)
    })
  })
}

exports.createDeployment = function (req, res) {
  addPlan(req.params.pipelineId, req.params.stageId, req.body)
  .then(function (result) {
    res.json(result)
  }, function (err) {
    res.status(500).json({error: err})
  })
}

exports.getNodes = function (req, res) {
  try {
    res.json(plan[req.params.stageId][req.params.number].nodes)
  } catch (err) {
    res.status(404).json({error: 'Data not found'})
  }
}
