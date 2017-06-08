var pipelineClient = require('../utils/pipelineClient')

var log = require('../utils/logger')('deployment')

var stages = {}
var plan = {}

function addPlan (pipelineId, stageId, data) {
  log.debug('addPlan', pipelineId, stageId, data)
  return new Promise(function (resolve, reject) {
    // Get inputs for the stage
    pipelineClient.getInputs(pipelineId, stageId)
    .then(function (result) {
      if (result.length === 0) {
        let message = 'No input for stage'
        log.error(message, stageId)
        reject(new Error(message))
      }
      let inputId = result[0].id
      if (!stageId.hasOwnProperty(stageId)) {
        stages[stageId] = {}
      }
      stages[stageId].inputId = inputId
      data.inputId = inputId
      log.debug('got Inputs', inputId, data, result)
    })
    .then(function () {
      let args = {
        inputId: data.inputId,
        revisionId: data.revisionId
      }
      log.debug('runStage with', args)
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
      resolve(detail)
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

exports.getTargetNodes = function (req, res) {
  let stageId = req.params.stageId
  try {
    res.json(plan[stageId][req.params.number].nodes)
  } catch (err) {
    if (!stages.hasOwnProperty(stageId)) {
      stages[stageId] = {
        pipelineId: req.params.pipelineId,
        serviceName: req.query.service
      }
      res.status(201).json({result: 'Stage data created'})
    } else {
      res.status(404).json({error: 'Data not found'})
    }
  }
}

exports.getStage = function (req, res) {
  try {
    res.json(stages[req.params.stageId])
  } catch (err) {
    res.status(404).json({error: 'Data not found'})
  }
}
