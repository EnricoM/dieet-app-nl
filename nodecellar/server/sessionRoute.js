var sessionHandler = require('./sessionHandler');

function SessionRoute(db) {
	
	this.logonUser = function (req, res, next) {
		console.log('In SessionRoute, function logonUser');
		var session = {
			"email" : req.body.email,
			"pwd" : req.body.pwd
		};
		sessionHandler.readUser(session, db, function(resultMessage) {
			next(resultMessage);
		});
	};

	this.verifyLoggedOn = function(req, res, next) {
		console.log('In SessionRoute, function verifyLoggedOn');
		var session = {
			"sessionId" : req.cookies.session
		};
		sessionHandler.readSession(session, db, function(result) {
			next(result);
		});
	};
	
	this.logoffUser = function(req, res, next) {
		console.log('In SessionRoute, function logoffUser');
		var session = {
			"sessionId" : req.cookies.session
		};
		
		sessionHandler.deleteSession(session, db, function(resultMessage) {
			console.log('In SessionRoute, function logoffUser, result from handler', resultMessage);
			next(resultMessage);
		});
	};	
	
	this.registerUser = function (req, res, next) {
		console.log('In SessionRoute, function registerUser');
		var registration = {
			"userName" : req.body.userName,
			"email" : req.body.email,
			"pwd" : req.body.pwd
		};
		sessionHandler.createUser(registration, db, function(resultMessage) {
			next(resultMessage);
		});
	};
};

module.exports = SessionRoute;