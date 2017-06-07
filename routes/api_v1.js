var express = require('express');
var router = express.Router();

var deployment = require('./deployment');

router.post('/deploy_plan/:toolchain_id/:pipeline_id/:stage_id', deployment.createDeployment);
router.get('/deploy_plan/:toolchain_id/:pipeline_id/:stage_id/:number/nodes', deployment.getNodes);

module.exports = router;
