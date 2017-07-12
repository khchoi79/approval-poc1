var express = require('express')
var router = express.Router()

var approval = require('./approval')
var deployment = require('./deployment')

router.get('/approvals', approval.getApprovals)
router.get('/approvals/:pipelineId/stages/:stageId', approval.getApprovals)
router.get('/approvals/:pipelineId/stages/:stageId/jobs/:jobId/artifacts/:artifactId', approval.getApproval)
router.get('/approvals/:pipelineId/stages/:stageId/jobs/:jobId/artifacts/:artifactId/status', approval.getApprovalStatus)
router.post('/approvals/:pipelineId/stages/:stageId/jobs/:jobId/artifacts/:artifactId', approval.addApproval)
router.put('/approvals/:pipelineId/stages/:stageId/jobs/:jobId/artifacts/:artifactId', approval.updateApproval)

router.get('/deployment', deployment.getStages)
router.get('/deployment/:pipelineId/stages/:stageId/builds', deployment.getDeployments)
router.post('/deployment/:pipelineId/stages/:stageId/builds', deployment.createDeployment)
router.get('/deployment/:pipelineId/stages/:stageId/builds/:number/nodes', deployment.getTargetNodes)
router.get('/deployment/:pipelineId/stages/:stageId', deployment.getStage)

router.get('/deployment/:pipelineId/stages/:stageId/builds', deployment.getDeployments)
router.post('/deployment/:pipelineId/stages/:stageId/builds', deployment.createDeployment)
router.get('/deployment/:pipelineId/stages/:stageId/builds/:number/nodes', deployment.getTargetNodes)
router.get('/deployment/:pipelineId/stages/:stageId', deployment.getStage)

router.put('/nodes/:nodeName', deployment.updateNode)

module.exports = router
