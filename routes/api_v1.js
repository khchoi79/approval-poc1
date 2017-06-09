var express = require('express')
var router = express.Router()

var deployment = require('./deployment')

router.post('/deployment/:pipelineId/stages/:stageId/builds', deployment.createDeployment)
router.get('/deployment/:pipelineId/stages/:stageId/builds/:number/nodes', deployment.getTargetNodes)
router.get('/deployment/:pipelineId/stages/:stageId', deployment.getStage)

router.put('/nodes/:nodeName', deployment.updateNode)

module.exports = router
