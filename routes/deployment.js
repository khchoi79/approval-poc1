var plan = {};

var stages = {};

function add_plan(stage_id, detail) {
    return new Promise(function (resolve, reject) {
        if (!plan.hasOwnProperty(stage_id)) {
            plan[stage_id] = {};
        }
        plan[stage_id][number] = detail;
        resolve();
    });
}

function get_targets(stage_id, number) {
    return plan[stage_id[number]];
}

exports.createDeployment = function(req, res) {
    add_plan(req.params.stage_id, req.body)
    .then(function() {
        console.log(plan);
        res.json({'status': 'ok'});
    }, function(err) {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.getNodes = function(req, res) {
    return plan[req.params.stage_id][req.params.number];
}

