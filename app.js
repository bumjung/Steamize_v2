// set up ======================================================================
var express = require('express');
var path    = require('path');
var app     = express();
var router  = express.Router();
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var methodOverride = require('method-override');

var database = require('./config/database');

// configuration ===============================================================
mongoose.connect(database.url);

app.set("view options", {layout: false});
app.use("/dist", express.static(__dirname + "/dist"));
app.use("/src", express.static(__dirname + "/src"));
app.set('views', __dirname + '/src/core/mvc/view');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 4455);

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================
require('./app/routes')(app, router);

// listen ======================================================================
app.listen(app.get('port'));
console.log("Listening on port localhost:" + app.get('port'));

