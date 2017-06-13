var pipelineClient = require('../utils/pipelineClient')
var consulClient = require('../utils/consulClient')

var Plan = require('../databases/models/deploy-plan')

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
      if (!stages.hasOwnProperty(stageId)) {
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

      let plan = new Plan(detail)
      return plan.save()
    })
    .then(saved => resolve(saved))
    .catch(err => reject(err))
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
      stages[stageId] = {}
      res.status(201).json({result: 'Stage data created'})
    } else {
      res.status(404).json({error: 'Data not found'})
    }
  }
  if (!stages[stageId].hasOwnProperty('serviceName')) {
    stages[stageId].pipelineId = req.params.pipelineId
    stages[stageId].serviceName = req.query.service
  }
}

exports.getStage = function (req, res) {
  try {
    res.json(stages[req.params.stageId])
  } catch (err) {
    res.status(404).json({error: 'Data not found'})
  }
}

exports.updateNode = function (req, res) {
  log.debug('updateNode', req.params.nodeName, req.body)
  consulClient.updateNodeMeta(req.params.nodeName, req.body)
  .then((data) => {
    res.status(200).json({result: data})
  }).catch((err) => {
    log.error('updateNode', err)
    res.status(500).json({error: err})
  })
}
