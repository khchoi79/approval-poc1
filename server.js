var express = require("express"),
    app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

var bodyParser = require('body-parser');

app.use(bodyParser.json());

var approvals={}

app.post('/api/v1/toolchain/:toolchain_id/:pipeline_id', function(req, res) {
  var data = {
    'toolchain_id': req.params.toolchain_id,
    'pipeline_id': req.params.pipeline_id,
    'input_rev': req.body.input_rev,
    'body': req.body
  }
  console.log(data);
  var input_rev = req.body.input_rev;
  var result = {};
  if (input_rev in approvals) {
    result['status'] = approvals[input_rev];
  } else {
    // create new approval record
    approvals[input_rev] = 'pending';
    result['status'] = 'created';
  }
  res.send(result);
});

app.listen(port);
console.log("Listening on port ", port);
