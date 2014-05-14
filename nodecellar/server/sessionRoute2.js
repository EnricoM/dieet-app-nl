var sessionHandler = require('./sessionHandler');
var iz = require('iz');

function SessionRoute(db) {
	
	this.postSession = function (req, res, next) {
		console.log('In SessionRoute, function postSession');
		var session = {
			"email" : req.body.email,
			"pwd" : req.body.pwd
		};
		
		sessionHandler.postSession(session, db, function(resultMessage) {
			next(resultMessage);
		});
	};

	this.getSession = function(req, res, next) {
		console.log('In SessionRoute, function getSession');
		var session = {
			"sessionId" : req.cookies.session
		};
		sessionHandler.getSession(session, db, function(result) {
			next(result);
		});
	};
	
	this.deleteSession = function(req, res, next) {
		console.log('In SessionRoute, function deleteSession');
		var session = {
			"sessionId" : req.cookies.session
		};
		
		// input checks
		sessionHandler.deleteSession(session, db, function(resultMessage) {
			console.log('In SessionRoute, function deleteSession, result from handler', resultMessage);
			next(resultMessage);
		});
	};	
	
/*	
	var sessionIdIz = function() {	
		var errors = {
			alphaNumeric: 'Must be numbers and/or letters',
			maxLength: 'size should not be above 250',
		}
		var newIz = iz(session.sessionId, errors).alphaNumeric().maxLength(300);
		if(newIz.valid){
			sessionHandler.deleteSession(session, db, function(resultMessage) {
				console.log('In SessionRoute, function logoffUser, result from handler', resultMessage);
				next(resultMessage);
			});
		} else {
			var	data = {};
			var messages = [] 
			var message;
			message = {	
				"messageType" : "ERROR",
				"messageCode" : "INPUT_VALIDATION_0001",
				"messageText" : "Invalid session"
			};
			data.messages = messages;
			messages.push(message);	
			next(data);
		}	
	};
*/	
};

module.exports = SessionRoute;