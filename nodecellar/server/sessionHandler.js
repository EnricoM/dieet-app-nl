var sessionDAO = require('./sessionDAO');

function deleteSession(session, db, result) {
	if (session.sessionId) {
		sessionDAO.deleteSession(session.sessionId, db, function(resultCode, doc) {
			if (resultCode === "SUCCESS") {
				result(resultCode);
			} else {
				result("SESSION_NOT_FOUND");
			}
		});
	} else {
		result("SESSION_NOT_FOUND");
	}
};
	
function readSession(session, db, next) {
	if (session.sessionId) {
		sessionDAO.readSession(session.sessionId, db, function(resultCode, doc) {
			if (resultCode === "SUCCESS") {
				var result = {
					email : doc.email,
					resultCode : "SUCCESS"
				}
				next(result);
			} else {
				var result = {
					resultCode : "SESSION_NOT_FOUND"
				}
				next(result);
			}
		});
	} else {
		var result = {
			resultCode : "SESSION_NOT_FOUND"
		}
		next(result);
	}
};
	
function readUser(session, db, result) {
	var errors = new Errors();
	if (logonUserValidation(session, errors)) {
		sessionDAO.readUser(session, db, function(resultCode, doc) {
			if (resultCode) {
				if (resultCode === "SUCCESS") {
					sessionDAO.createSession(session.email, db, function(sessResult, session) {
						if(sessResult) {
							if (sessResult === "SUCCESS") {
								errors.success = true;
								var returnMessage = logonUserResultMessage(errors, session);
								result(returnMessage);
							} else {
								errors.technical_error = true;
								var returnMessage = logonUserResultMessage(errors);
								result(returnMessage);	
							}
						} else {
							errors.technical_error = true;
							var returnMessage = logonUserResultMessage(errors);
							result(returnMessage);							
						}
					});								
				} else if (resultCode === "DB_ERROR") {
					errors.technical_error = true;
					var returnMessage = logonUserResultMessage(errors);
					result(returnMessage);					
				} else if (resultCode === "INVALID_PASSWORD") {
					errors.invalid_password_error = true;
					var returnMessage = logonUserResultMessage(errors);
					result(returnMessage);						
				} else if (resultCode === "NOT_FOUND") {
					errors.not_found_error = true;
					var returnMessage = logonUserResultMessage(errors);
					result(returnMessage);
				};
			} else {
				errors.technical_error = true;
				var returnMessage = logonUserResultMessage(errors);
				result(returnMessage);					
			}
		});
	} else {
		var returnMessage = logonUserResultMessage(errors);
		result(returnMessage);
	}
};

	
function createUser(registration, db, result) {
	var errors = new Errors();
	if (registerUserValidation(registration, errors)) {
		sessionDAO.createUser(registration, db, function(resultCode, doc) {
			if (resultCode) {
				if (resultCode === "SUCCESS") {
					sessionDAO.createSession(registration.email, db, function(sessResult, session) {
						if(sessResult && sessResult === "SUCCESS") {
							errors['success'] = true;
							var returnMessage = registerUserResultMessage(errors, session);
							result(returnMessage);
						} else {
							errors['technical_error'] = true;
							var returnMessage = registerUserResultMessage(errors);
							result(returnMessage);							
						}
					});		
				} else if (resultCode === "DUPLICATE_KEY_ERROR") {
					errors['duplicate_key_error'] = true;
					var returnMessage = registerUserResultMessage(errors);
					result(returnMessage);					
				} else {
					errors['technical_error'] = true;
					var returnMessage = registerUserResultMessage(errors);
					result(returnMessage);
				}
			} else {
				errors['technical_error'] = true;
				var returnMessage = registerUserResultMessage(errors);
				result(returnMessage);			
			}
		});
	} else {
		var returnMessage = registerUserResultMessage(errors);
		result(returnMessage);
	}
};

function registerUserValidation(registration, errors) {
	var PASS_RE = /^.{3,20}$/;
	var EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;
	var noErrors = true;

/*
	if (registration.firstName) {
		if (registration.firstName === "") {		
			errors.firstName_error = true;
			noErrors = false;
		}
	} else {
		errors.firstName_error = true;
		noErrors = false;		
	}
	
	if (registration.lastName) {	
		if (registration.lastName === "") {		
			errors['lastName_error'] = true;
			noErrors = false;
		}
	} else {
		errors['lastName_error'] = true;
		noErrors = false;		
	}
*/
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
	
function registerUserResultMessage(errors, session) {
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
			"messageCode" : "REGISTRATION_0000",
			"messageText" : "Gegevens toegevoegd"
		};		
		messages.push(message);	
	}			
	if (errors.firstName_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "REGISTRATION_0001",
			"messageText" : "Fout in voornaam"
		};
		messages.push(message);	
	}
	if (errors.lastName_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "REGISTRATION_0002",
			"messageText" : "Fout in achternaam"
		};
		messages.push(message);	
	}
	if (errors.password_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "REGISTRATION_0003",
			"messageText" : "Fout in wachtwoord"
		};
		messages.push(message);	
	}
	if (errors.email_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "REGISTRATION_0004",
			"messageText" : "Fout in email"
		};
		messages.push(message);	
	}
	if (errors.technical_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "REGISTRATION_0005",
			"messageText" : "Technische fout"
		};
		messages.push(message);	
	}		
	if (errors.duplicate_key_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "REGISTRATION_0006",
			"messageText" : "email bestaat al"
		};
		messages.push(message);	
	}		
	return data;
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