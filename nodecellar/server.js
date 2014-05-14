var express = require('express'),
	MongoClient = require('mongodb').MongoClient,
	path = require('path'),
	routes = require('./routes');
var Config = require('./routes/config'), 
	conf = new Config();
	
MongoClient.connect('mongodb://localhost:27017/dieet', function(err, db) {

	var app = express();

	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		res.header('Access-Control-Allow-Credentials', 'true');
		next();
	}
	
	app.set('port', conf.PORT || 7396);
	app.set('env', process.env.NODE_ENV || 'development');

	app.use(express.favicon('./favicon.ico')); 
	app.use(allowCrossDomain);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.logger('dev'));

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	routes(app, db);

	app.listen(app.get('port'));
	console.log('Listening on port ' + app.get('port') + '...');
});