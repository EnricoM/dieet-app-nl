var sessionDAO = require('./sessionDAO2');
var userDAO = require('./userDAO');

function deleteSession(session, db, next) {
	console.log('In sessionHanddler, function deleteSession', session);
	sessionDAO.deleteSession(session.sessionId, db, function(resultCode, doc) {
		next(result);
	});
};
	
function getSession(session, db, next) {
	console.log('In sessionHanddler, function getSession', session);
	sessionDAO.getSession(session.sessionId, db, function(result) {
		next(result);
	});
};
	
function postSession(session, db, next) {
	console.log('In sessionHanddler, function postSession', session);
	var result = {};
	userDAO.getUser(session, db, function(userResult) {
		if (userResult && userResult.resultCode) {
			if (userResult.resultCode === "SUCCESS") {
				sessionDAO.postSession(session.email, db, function(sessionResult) {
					if(sessionResult) {
						result = sessionResult;
					} else {
						result.resultCode = "TECHNICAL_ERROR";
					}
				});								
			} else {
				result = userResult
			}
		} else {
			result.resultCode = "TECHNICAL_ERROR";
		}
		next(result);
	});
};

function logonUserValidation(registration, errors) {
	var PASS_RE = /^.{3,20}$/;
	var EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;
	var noErrors = true;

	if (registration.pwd) {		
		if (registration.pwd !== "") {	
			if (!PASS_RE.test(registration.password)) {
				errors['password_error'] = true;
				noErrors = false;
			}
		} else {
			errors['password_error'] = true;
			noErrors = false;
		}
	} else {
		errors['password_error'] = true;
		noErrors = false;	
	}

	if (registration.email) {
		if (registration.email !== "") {	
			if (!EMAIL_RE.test(registration.email)) {
				errors['email_error'] = true;
				noErrors = false;
			}
		} else {
			errors['email_error'] = true;
			noErrors = false;			
		}
	} else {
		errors['email_error'] = true;
		noErrors = false;	
	}

	return noErrors;		
};
	
function logonUserResultMessage(errors, session) {
	var	data = {};
	var messages = [] 
	var message;
	
	if (session) {
		data.sessionId = session._id;
		data.expires = session.expires;
	}
	data.messages = messages;
	if (errors.success === true) {
		message = {	
			"messageType" : "SUCCESS",
			"messageCode" : "LOGON_0000",
			"messageText" : "Gegevens toegevoegd"
		};		
		messages.push(message);	
	}			
	if (errors.password_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "LOGON_0001",
			"messageText" : "Fout in wachtwoord"
		};
		messages.push(message);	
	}
	if (errors.email_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "LOGON_0002",
			"messageText" : "Fout in email"
		};
		messages.push(message);	
	}
	if (errors.technical_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "LOGON_0003",
			"messageText" : "Technische fout"
		};
		messages.push(message);	
	}		
	if (errors.not_found_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "LOGON_0004",
			"messageText" : "gebruiker niet gevonden"
		};
		messages.push(message);	
	}	
	if (errors.invalid_password_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "LOGON_0005",
			"messageText" : "fout wachtwoord"
		};
		messages.push(message);	
	}				
	return data;
};
	
function Errors() {
	this.success = false;
	this.firstName_error = false;
	this.lastName_error = false;
	this.pwd_error = false;
	this.email_error = false;
	this.technical_error = false;
	this.duplicate_key_error = false;
	this.not_found_error = false;
	this.invalid_password_error = false;
};

exports.createUser = createUser;
exports.deleteSession = deleteSession;
exports.readSession = readSession;
exports.readUser = readUser;