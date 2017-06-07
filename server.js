var express = require('express')
var app = express()
var path = require('path')

var port = process.env.PORT || 8080
app.use(express.static(path.join(__dirname, '/public')))

var bodyParser = require('body-parser')
var cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

var approvals = {}

function getApproval (artifactId) {
  return approvals[artifactId] || {'status': 'none'}
}

function addApproval (data) {
  approvals[data.artifactId] = data
}

function updateApproval (artifactId, newStatus) {
  approvals[artifactId]['status'] = newStatus
}
app.get('/api/v1/approvals/:toolchain_id/:pipeline_id/:stage_id/:artifactId', function (req, res) {
  res.send(getApproval(req.params.artifactId))
})

app.get('/api/v1/approvals/:toolchain_id/:pipeline_id/:stage_id/:artifactId/status', function (req, res) {
  res.send(getApproval(req.params.artifactId).status)
})

app.post('/api/v1/approvals/:toolchain_id/:pipeline_id/:stage_id/:artifactId', function (req, res) {
  // TODO: Cloudant for database
  // create new approval record
  addApproval(Object.assign({}, req.params, req.body, {
    'status': 'pending'
  }))
  res.send(getApproval(req.params.artifactId))
})

app.post('/api/v1/approvals/:artifactId', function (req, res) {
  updateApproval(req.params.artifactId, req.body.status)
  res.json({'status': 'ok'})
})

app.get('/api/v1/approvals', function (req, res) {
  res.json(approvals)
})

app.use('/api/v1', require('./routes/api_v1'))

app.listen(port)
console.log('Listening on port ', port)
