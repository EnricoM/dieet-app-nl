var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

function createUser(registration, db, queryResult) {
	var users = db.collection("users");
	var salt = bcrypt.genSaltSync();
	var password_hash = bcrypt.hashSync(registration.pwd, salt);
	var query = {'_id': registration.email, 'password': password_hash, 'firstName' : registration.firstName, 'lastName' : registration.lastName, 'status' : "ACTIVE", "invalidLogons" : 0};

	users.insert(query, function(err, document) {
		if(err) {
			if(err.code === 11000) {
				queryResult("DUPLICATE_KEY_ERROR", null);
			} else {
				queryResult("DB_ERROR", null);
			}
		} else if (document && document[0]) {
			queryResult("SUCCESS", document[0]);
		} else {
			queryResult("UNKNOWN_ERROR", null);
		};
	})
};

function readUser(session, db, queryResult) {
	var users = db.collection("users");
	var query = {'_id': session.email};
	console.log("readUser", query);
	users.findOne(query, function(err, document) {
		if(err) {
			queryResult("DB_ERROR", null);
		} else if (document) {
			if (bcrypt.compareSync(session.pwd, document.password)) {
				queryResult("SUCCESS", document);
			} else {
				queryResult("INVALID_PASSWORD", null);
			}
		} else {
			queryResult("NOT_FOUND", null);
		};
	})
};

function createSession(email, db, queryResult) {
	var sessions = db.collection("sessions");
	var d = new Date();
	var sessionMax = d.addHours(4);
	var n = sessionMax.getTime();
	var current_date = d.valueOf().toString();
	var random = Math.random().toString();
	var sessionId = crypto.createHash('sha1').update(current_date + random).digest('hex');
	var query = {'_id': sessionId, 'email': email, "expires" : n}

	sessions.insert(query, function (err, result) {
		if(err) {
			if(err.code === 11000) {
				queryResult("DUPLICATE_KEY_ERROR", null);
			} else {
				queryResult("DB_ERROR", null);
			}
		} else if (result && result[0]) {
			queryResult("SUCCESS", result[0]);
		} else {
			queryResult("UNKNOWN_ERROR", null);
		};
	});
};

function readSession(sessionId, db, queryResult) {
	var sessions = db.collection("sessions");
	var query = {'_id': sessionId};

	sessions.findOne(query, function(err, session) {
		if(err) {
			queryResult("DB_ERROR", null);
		} else if (session) {
			var d = new Date();
			var time = d.getTime();
			if (session.expires > time) {
				queryResult("SUCCESS", session);
			} else {
				this.deleteSession(sessionId, db, function(resultCode) {
					queryResult("EXPIRED_SESSION", null);
				})
			}
		} else {
			queryResult("NOT_FOUND", null);
		};
	})
};

function deleteSession(sessionId, db, queryResult) {
	var sessions = db.collection("sessions");
	var query = {'_id': sessionId};

	sessions.remove(query, function(err, session) {
		if(err) {
			queryResult("DB_ERROR", null);
		} else if (session) {
			queryResult("SUCCESS");
		} else {
			queryResult("NOT_FOUND", null);
		};
	})
};

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
exports.createUser = createUser;
exports.readUser = readUser;
exports.createSession = createSession;
exports.readSession = readSession;
exports.deleteSession = deleteSession;