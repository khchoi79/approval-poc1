var pipelineClient = require('../utils/pipelineClient')
var consulClient = require('../utils/consulClient')

var Plan = require('../databases/models/deploy-plan')
var Service = require('../databases/models/service-map')

var log = require('../utils/logger')('deployment')

function getInputId (doc) {
  return pipelineClient.getInputs(doc.pipelineId, doc.stageId)
  .then(function (result) {
    if (result.length === 0) {
      let message = 'No input for stage'
      log.error(message, doc.pipelineId, doc.stageId)
      throw Error(message)
    }
    doc.inputs = result
    doc.save()
    .then(saved => {
      log.debug('got Inputs', doc.inputs, result)
      return doc.inputs
    })
    .catch(err => {
      log.error('getInputId: Failed to save service map info with input', err)
      throw err
    })
  })
  .catch(err => {
    log.error(`getInputId: Cannot get input`, doc)
    throw err
  })
}

function addPlan (params, data) {
  log.debug('addPlan', params, data)
  // Get inputs for the stage
  return Service.findOne(params)
  .then(function (doc) {
    let args = {
      inputId: doc.inputs[0].id,
      revisionId: data.revisionId
    }
    log.debug('runStage with', args)
    // Execute stage and get results
    return pipelineClient.runStage(params.pipelineId, params.stageId, args)
  })
  .catch(err => {
    log.error(`addPlan: Cannot get service map`, params, err)
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
  .catch(err => {
    log.error(`addPlan: Failed to run stage`, params, err)
  })
}

exports.createDeployment = function (req, res) {
  addPlan(req.params, req.body)
  .then(function (result) {
    res.json(result)
  }, function (err) {
    res.status(500).json({error: err})
  })
}

exports.getDeployments = function (req, res) {
  Plan.find(req.params)
  .sort('number')
  .then(docs => res.json(docs))
  .catch(err => {
    log.error('getDeployments', err)
    res.status(500).json({error: err})
  })
}

exports.getTargetNodes = function (req, res) {
  Plan.findOne(req.params)
  .then(doc => {
    if (doc) {
      res.json(doc.nodes)
    } else {
      Service.findOne({
        pipelineId: req.params.pipelineId,
        stageId: req.params.stageId
      })
      .then(doc => {
        if (doc) {
          // TODO: check req.query.service === doc.serviceName
          res.status(404).json({error: 'Data not found'})
        } else {
          // create new stage / service information
          let detail = Object.assign({}, req.params)
          detail.serviceName = req.query.service
          let service = new Service(detail)
          service.save()
          .then(saved => {
            res.status(201).json({result: 'Stage data created'})
            getInputId(saved)
          })
        }
      })
    }
  })
  .catch(err => {
    log.error('getDeployments', err)
    res.status(500).json({error: err})
  })
}

exports.getStage = function (req, res) {
  Service.findOne(req.params)
  .then(doc => {
    if (doc) {
      res.json(doc)
      if (!doc.inputs) {
        getInputId(doc)
      }
    } else {
      res.status(404).json({error: 'Stage not found'})
    }
  })
  .catch(err => {
    log.error('getStage', err)
    res.status(500).json({error: err})
  })
  /*
try {
    res.json(stages[req.params.stageId])
  } catch (err) {
    res.status(404).json({error: 'Data not found'})
  }
  */
}

exports.getStages = function (req, res) {
  Service.find()
  .sort({'toolchainId': 1, 'pipelineId': 1, 'stageId': 1})
  .then(docs => res.json(docs))
  .catch(err => {
    log.error('getStages', err)
    res.status(500).json({error: err})
  })
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
