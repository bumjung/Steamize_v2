// set up ======================================================================
var express = require('express');
var path    = require('path');
var app     = express();
var router  = express.Router();
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var methodOverride = require('method-override');
var redis = require('redis');

var Redis = require('./app/redis');

var Account = require('./app/account');
var AccountController = require('./app/controller/AccountController');
var ProfileController = require('./app/controller/ProfileController');
var FriendsController = require('./app/controller/FriendsController');
var GamesController = require('./app/controller/GamesController');
var GamesDetailController = require('./app/controller/GamesDetailController');

// configuration ===============================================================
if (process.env.NODE_ENV === 'dev') {
	var dbConfig = require('./config/database');
	mongoose.connect(dbConfig.dev);

	var client 	= redis.createClient();
	var redis 	= new Redis(client);
} else {
	mongoose.connect(process.env.MONGOLAB_URI);

	var rtg 	= require("url").parse(process.env.REDISTOGO_URL);
	var client 	= redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
	var redis 	= new Redis(client);
}

client.on('error', function(e){
  console.log(e);
});


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
var accountController = new AccountController(redis);
var profileController = new ProfileController(redis);
var gamesController = new GamesController(redis);
var friendsController = new FriendsController(redis);
var gamesDetailController = new GamesDetailController(redis);

// routes ======================================================================
require('./app/routes')(app, router, account, accountController, profileController, friendsController, gamesController, gamesDetailController);

// listen ======================================================================
app.listen(app.get('port'));
console.log("Listening on port localhost:" + app.get('port'));

