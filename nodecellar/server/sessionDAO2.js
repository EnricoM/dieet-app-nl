var crypto = require('crypto');

function postSession(email, db, next) {
	var sessions = db.collection("sessions");
	var d = new Date();
	var sessionMax = d.addHours(4);
	var n = sessionMax.getTime();
	var current_date = d.valueOf().toString();
	var random = Math.random().toString();
	var sessionId = crypto.createHash('sha1').update(current_date + random).digest('hex');
	var query = {'_id': sessionId, 'email': email, "expires" : n}
	var result = {};
	
	sessions.insert(query, function (err, document) {
		if(err) {
			if(err.code === 11000) {
				result.resultCode = "DUPLICATE_KEY_ERROR";
			} else {
				result.resultCode = "DB_ERROR";
			}
		} else if (document && document[0]) {
			result._id = document[0].sessionId;
			result.expires = document[0].expires;
			result.resultCode = "SUCCESS";
		} else {
			result.resultCode = "UNKNOWN_ERROR";
		};
		next(result);
	});
};

function getSession(sessionId, db, queryResult) {
	var sessions = db.collection("sessions");
	var query = {'_id': sessionId};
	var result = {};
	
	sessions.findOne(query, function(err, session) {
		if(err) {
			queryResult("DB_ERROR", null);
		} else if (session) {
			var d = new Date();
			var time = d.getTime();
			if (session.expires > time) {
				result.email = doc.email,
				result.resultCode = "SUCCESS"
			} else {
				this.deleteSession(sessionId, db, function(resultCode) {
					result.resultCode = "EXPIRED_SESSION";
				})
			}
		} else {
			result.resultCode = "NOT_FOUND";
		};
		next(result);
	})
};

function deleteSession(sessionId, db, queryResult) {
	var sessions = db.collection("sessions");
	var query = {'_id': sessionId};
	var result = {};
	
	sessions.remove(query, function(err, session) {
		if(err) {
			result.resultCode = "DB_ERROR";
		} else if (session) {
			result.resultCode = "SUCCESS";
		} else {
			result.resultCode = "NOT_FOUND";
		};
		next(result);
	})
};

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
exports.postSession = createSession;
exports.getSession = readSession;
exports.deleteSession = deleteSession;