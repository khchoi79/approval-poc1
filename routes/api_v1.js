var express = require('express')
var router = express.Router()

var deployment = require('./deployment')

router.post('/deployment/:pipelineId/:stageId', deployment.createDeployment)
router.get('/deployment/:pipelineId/:stageId/:number/nodes', deployment.getNodes)

module.exports = router
