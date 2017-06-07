var plan = {}

function addPlan (stageId, detail) {
  return new Promise(function (resolve, reject) {
    if (!plan.hasOwnProperty(stageId)) {
      plan[stageId] = {}
    }
    plan[stageId][1] = detail
    resolve()
  })
}

exports.createDeployment = function (req, res) {
  addPlan(req.params.stageId, req.body)
  .then(function () {
    console.log(plan)
    res.json({'status': 'ok'})
  }, function (err) {
    console.log(err)
    res.status(500).json({error: err})
  })
}

exports.getNodes = function (req, res) {
  return plan[req.params.stageId][req.params.number]
}
