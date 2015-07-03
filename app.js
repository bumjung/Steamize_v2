// set up ======================================================================
var express = require('express');
var path    = require('path');
var app     = express();
var router  = express.Router();
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var methodOverride = require('method-override');

var dbConfig = require('./config/database');

var Account = require('./app/account');
var AccountController = require('./app/controller/AccountController');
var ProfileController = require('./app/controller/ProfileController');
var FriendsController = require('./app/controller/FriendsController');
var GamesController = require('./app/controller/GamesController');
var GamesDetailController = require('./app/controller/GamesDetailController');

// configuration ===============================================================
mongoose.connect(dbConfig.url);

app.use("/dist", express.static(__dirname + "/dist"));
app.use("/static", express.static(__dirname + "/static"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/src", express.static(__dirname + "/src"));
app.set('views', __dirname + '/src/core/mvc/view');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 4455);

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// constructors ================================================================
var account = new Account();
var accountController = new AccountController();
var profileController = new ProfileController();
var gamesController = new GamesController();
var friendsController = new FriendsController();
var gamesDetailController = new GamesDetailController();

// routes ======================================================================
require('./app/routes')(app, router, account, accountController, profileController, friendsController, gamesController, gamesDetailController);

// listen ======================================================================
app.listen(app.get('port'));
console.log("Listening on port localhost:" + app.get('port'));

