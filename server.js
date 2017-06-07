var express = require("express"),
    app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

var approvals = {};

function get_approval(artifact_id) {
  return approvals[artifact_id] || {'status': 'none'};
}

function add_approval(data) {
  approvals[data.artifact_id] = data;
}

function update_approval(artifact_id, new_status) {
  approvals[artifact_id]['status'] = new_status;
}
app.get('/api/v1/approvals/:toolchain_id/:pipeline_id/:stage_id/:artifact_id', function(req, res) {
  res.send(get_approval(req.params.artifact_id));
});

app.get('/api/v1/approvals/:toolchain_id/:pipeline_id/:stage_id/:artifact_id/status', function(req, res) {
  res.send(get_approval(req.params.artifact_id).status);
});

app.post('/api/v1/approvals/:toolchain_id/:pipeline_id/:stage_id/:artifact_id', function(req, res) {
  // TODO: Cloudant for database
  // create new approval record
  add_approval(Object.assign({}, req.params, req.body, {
    'status': 'pending'
  }));
  res.send(get_approval(req.params.artifact_id));
});

app.post('/api/v1/approvals/:artifact_id', function(req, res) {
  update_approval(req.params.artifact_id, req.body.status);
  res.json({'status': 'ok'});
});

app.get('/api/v1/approvals', function(req, res) {
  res.json(approvals);
});

app.listen(port);
console.log("Listening on port ", port);
