var settingsHandler = require('./settingsHandler');

function SettingsRoute(db) {
	
	this.readSettings = function (req, res, next) {
		if (req.param.email) {
			var settings = {
				"email" : req.param.email
			}
			settingsHandler.readSettings(settings, db, function(returnMessage) {
				next(returnMessage);
			})
		}	
	};
	
	this.storeSettings = function (req, res, next) {
		var settings = {
			"firstName" : req.body.firstName,
			"lastName" : req.body.lastName,			
			"email" : req.param.email,
			"dateOfBirth" : req.body.dateOfBirth,
			"sexe" : req.body.sexe,
			"length" : req.body.length,
			"weight" : req.body.weight,
			"desiredWeight" : req.body.desiredWeight,
			"exercise" : req.body.exercise
		};
		settingsHandler.storeSettings(settings, db, function(returnMessage) {
			next(returnMessage);	
		});
	};

	this.updateSettings = function (req, res, next) {
		var settings = {
			"email" : req.param.email,
			"firstName" : req.body.firstName,
			"lastName" : req.body.lastName,						
			"dateOfBirth" : req.body.dateOfBirth,
			"sexe" : req.body.sexe,
			"length" : req.body.length,
			"weight" : req.body.weight,
			"desiredWeight" : req.body.desiredWeight,
			"exercise" : req.body.exercise, 
			"reduceTDEE" : req.body.reduceTDEE
		};
		settingsHandler.updateSettings(settings, db, function(returnMessage) {
			next(returnMessage);	
		});
	};

};
module.exports = SettingsRoute;