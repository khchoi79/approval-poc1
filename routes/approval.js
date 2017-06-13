var log = require('../utils/logger')('approval')

var approvals = {}

function _getApproval (artifactId) {
  return approvals[artifactId] || {'status': 'none'}
}

module.exports = {
  getApprovals (req, res) {
    res.json(approvals)
  },

  getApproval (req, res) {
    res.json(_getApproval(req.params.artifactId))
  },

  getApprovalStatus (req, res) {
    res.send(_getApproval(req.params.artifactId).status)
  },

  addApproval (req, res) {
    // create new approval record
    let data = Object.assign({}, req.params, req.body, {
      'status': 'pending'
    })
    approvals[req.params.artifactId] = data
    log.debug('New approval created', data)
    res.json(data)
  },

  updateApproval (req, res) {
    approvals[req.params.artifactId]['status'] = req.body.status
    log.debug('Approval updated:', req.params, req.body)
    res.json({'status': 'ok'})
  }
}
