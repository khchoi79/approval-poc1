var express = require('express')
var router = express.Router()

var deployment = require('./deployment')

router.post('/deploy_plan/:toolchainId/:pipelineId/:stageId', deployment.createDeployment)
router.get('/deploy_plan/:toolchainId/:pipelineId/:stageId/:number/nodes', deployment.getNodes)

module.exports = router
