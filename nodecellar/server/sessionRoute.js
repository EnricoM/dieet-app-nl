var sessionHandler = require('./sessionHandler');

function SessionRoute(db) {
	
	this.logoffUser = function(req, res, next) {
		var session = {
			"sessionId" : req.cookies.session
		};
		sessionHandler.logoffUser(session, db, function(resultMessage) {
			next(resultMessage);
		});
	};
	
	this.verifyLoggedOn = function(req, res, next) {
		var session = {
			"sessionId" : req.cookies.session
		};
		sessionHandler.verifyLoggedOn(session, db, function(result) {
			next(result);
		});
	};
	
	this.logonUser = function (req, res, next) {
		var session = {
			"email" : req.body.email,
			"pwd" : req.body.pwd
		};
		sessionHandler.logonUser(session, db, function(resultMessage) {
			if(resultMessage.messages[0].messageType === "SUCCESS") {
				res.cookie('session', resultMessage.sessionId, { maxAge: 7200000 });
			}
			next(resultMessage);
		});
	};

	
	this.registerUser = function (req, res, next) {
		var registration = {
			"firstName" : req.body.firstName,
			"lastName" : req.body.lastName,
			"email" : req.body.email,
			"pwd" : req.body.pwd
		};
		sessionHandler.registerUser(registration, db, function(resultMessage) {
			if(resultMessage.messages[0].messageType === "SUCCESS") {
				res.cookie('session', resultMessage.sessionId, { maxAge: 7200000 });
			}
			next(resultMessage);
		});
	};
};

module.exports = SessionRoute;