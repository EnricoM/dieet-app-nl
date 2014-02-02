var express = require('express'),
	MongoClient = require('mongodb').MongoClient,
	path = require('path'),
	routes = require('./routes');
var Config = require('./routes/config'), 
	conf = new Config();
	
MongoClient.connect('mongodb://localhost:27017/dieet', function(err, db) {

	var app = express();
	app.set('port', conf.PORT || 7396);
	app.set('env', process.env.NODE_ENV || 'development');

	app.use(express.favicon('./favicon.ico')); 
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.logger('dev'));

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	routes(app, db);

	app.listen(app.get('port'));
	console.log('Listening on port ' + app.get('port') + '...');
});