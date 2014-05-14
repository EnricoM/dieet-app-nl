var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

function createSettings(userSettings, db, queryResult) {
	var settings = db.collection("settings");
	var query = {
		'_id': userSettings.email, 
		'firstName' : userSettings.firstName,
		'lastName' : userSettings.lastName,
		'dateOfBirth': userSettings.dateOfBirth, 
		'sexe' : userSettings.sexe, 
		'length' : userSettings.length, 
		'weight' : userSettings.weight, 
		'desiredWeight' : userSettings.desiredWeight, 
		'exercise' : userSettings.exercise,
		'BMR' : parseInt(userSettings.BMR),
		'TDEE' : parseInt(userSettings.TDEE)
	};
	
	settings.insert(query, function(err, setting) {
		if(err) {
			if(err.code === 11000) {
				queryResult("DUPLICATE_KEY_ERROR", null);
			} else {
				queryResult("DB_ERROR", null);
			}
		} else if (setting && setting[0]) {
			queryResult("SUCCESS", setting[0]);
		} else {
			queryResult("UNKNOWN_ERROR", null);
		};
	})
};

function readSettings(userSettings, db, queryResult) {
	var settings = db.collection("settings");
	var query = {'_id': userSettings.email};

	settings.findOne(query, function(err, document) {
		if(err) {
			queryResult("DB_ERROR", null);
		} else if (document) {
			queryResult("SUCCESS", document);
		} else {
			queryResult("NOT_FOUND", null);
		};
	})
};

function updateSettings(userSettings, db, queryResult) {
	var settings = db.collection("settings");
	var query = { '_id': userSettings.email };
	var operation = {
		'firstName' : userSettings.firstName,
		'lastName' : userSettings.lastName,	
		'dateOfBirth': userSettings.dateOfBirth, 
		'sexe' : userSettings.sexe, 
		'length' : userSettings.length, 
		'weight' : userSettings.weight, 
		'desiredWeight' : userSettings.desiredWeight, 
		'exercise' : userSettings.exercise,
		'BMR' : userSettings.BMR,
		'TDEE' : userSettings.TDEE,
		'reduceTDEE' : userSettings.reduceTDEE,
		'targetKcal' : userSettings.targetKcal
	};
		
	settings.update(query, operation, function(err, setting) {	
		if(err) {
			queryResult("DB_ERROR", null);
		} else {
			queryResult("SUCCESS", setting);
		} 
	})
};

exports.createSettings = createSettings;
exports.updateSettings = updateSettings;
exports.readSettings = readSettings;