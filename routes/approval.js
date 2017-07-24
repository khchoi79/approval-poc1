var pipelineClient = require('../utils/pipelineClient')
var Approval = require('../databases/models/approval')

var log = require('../utils/logger')('approval')

function _getApproval (params) {
  return Approval.findOne(params)
  .then(doc => {
    if (!doc) {
      return {
        status: 'none'
      }
    }
    return doc
  })
  .catch(err => {
    log.error('Cannot find approval', err)
    throw err
  })
}

function getInputs (doc) {
  return pipelineClient.getInputs(doc.pipelineId, doc.stageId)
  // get job input
  .then(result => {
    if (result.length === 0) {
      let message = 'No input for stage'
      throw Error(message)
    }
    doc.inputs = result
    log.trace('Inputs', doc.inputs)
    return pipelineClient.getExecutionsByArtifactId(
        doc.pipelineId, result[0].stageId, doc.artifactId)
  })
  // get scm revisionId
  .then(result => {
    if (result.length === 0) {
      log.debug('getExecutionsByArtifactId: cannot find executions', doc)
    } else {
      try {
        doc.revisionId = result.inputs[0].revisionId
        log.trace('saivng revisionId', doc)
        return pipelineClient.getInputs(doc.pipelineId, doc.inputs[0].stageId)
      } catch (err) {
        log.debug('getExecutionsByArtifactId: no revisionId found', result, err)
      }
    }
  })
  .catch(err => {
    log.error('getExecutionsByArtifactId: error on finding executions', err)
  })
  // get scm input
  .then(result => {
    if (result) {
      if (result.length === 0) {
        log.error('getInputs: cannot find inputs', result)
      } else {
        if (result[0].type === 'scm') {
          doc.scmInputs = result
          log.trace('SCM inputs', result)
          return pipelineClient.getInputRevision(
              doc.pipelineId, doc.inputs[0].stageId,
              doc.scmInputs[0].id, doc.revisionId)
        } else {
          log.debug('getInputs: no scm input found', result)
        }
      }
    }
  })
  .catch(err => {
    log.error('getInputs: error on finding prev inputs', err)
  })
  // get scm input
  .then(result => {
    if (result) {
      doc.inputRevision = result
      log.trace('inputRevision', result)
    }
  })
  .catch(err => {
    log.error('getInputRevision: error on finding revision', doc, err)
  })
  // save doc
  .then(() => {
    doc.save()
    .then(saved => {
      return saved
    })
    .catch(err => {
      log.error('getInputId: Failed to save service map info with input', err)
      throw err
    })
  })
  .catch(err => {
    log.error('getInputId: Cannot get input', doc)
    throw err
  })
}

module.exports = {
  getApprovals (req, res) {
    let params = Object.assign({}, req.params)
    if (req.query.hasOwnProperty('approver')) {
      params.approvers = req.query.approver
    }
    Approval.find(params)
    .sort({'toolchainId': 1, 'pipelineId': 1, 'stageId': 1})
    .then(docs => res.json(docs))
    .catch(err => {
      log.error('getApprovals: Cannot get approvals', err)
      res.status(500).json({error: err})
    })
  },

  getApproval (req, res) {
    _getApproval(req.params)
    .then(approval => res.send(approval))
  },

  getApprovalStatus (req, res) {
    _getApproval(req.params)
    .then(approval => res.send(approval.status))
  },

  addApproval (req, res) {
    // create new approval record
    let data = Object.assign({}, req.params, req.body, {
      'status': 'pending'
    })
    let approval = new Approval(data)
    approval.save()
    .then(saved => {
      res.status(201).json(saved)
      log.debug('New approval created', saved)
      getInputs(saved)
    })
    .catch(err => {
      log.error('addApproval: Cannot save approal', err)
      res.status(500).json({error: err})
    })
  },

  updateApproval (req, res) {
    Approval.updateOne(req.params, {
      $set: {
        status: req.body.status
      }
    })
    .then(result => {
      log.debug('Approval updated', result)
      res.json({'status': 'ok'})
      if (req.body.status === 'accepted') {
        Approval.findOne(req.params)
        .then(doc => {
          let args = {
            inputId: doc.inputs[0].id,
            revisionId: doc.inputRev
          }
          log.debug('runStage with', args)
          // Execute stage and get results
          log.info('Run')
          pipelineClient.runStage(req.params.pipelineId, req.params.stageId, args)
        })
      }
    })
    .catch(err => {
      log.error('updateApproval: Cannot update approal', err)
      res.status(500).json({error: err})
    })
  }
}
