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

module.exports = {
  getApprovals (req, res) {
    Approval.find()
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
      res.json(saved)
      log.debug('New approval created', saved)
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
    })
    .catch(err => {
      log.error('updateApproval: Cannot update approal', err)
      res.status(500).json({error: err})
    })
  }
}
