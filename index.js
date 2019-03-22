var express = require('express');
var natgeo = require('national-geographic-api').NationalGeographicAPI;
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: "World"}));
});

app.get('/api/dailyphoto', function(req, res) {
    natgeo.getPhotoOfDay().then((result) => {
        res.jsonp({ 
            all:            result,
            src:            result.data[0].attributes.image.uri,
            alt:            result.data[0].attributes.image.title,
            description:    result.data[0].attributes.image.alt_text,
            credit:         result.data[0].attributes.image.credit
        });
    }, (reason) => {
        handleError(res, reason, "Failed to get dailyphoto.", 400);
    });
});
