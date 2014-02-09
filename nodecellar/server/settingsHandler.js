var settingsDAO = require('./settingsDAO');

function Errors() {
	this.success = false;
	this.birthday_error = false;
	this.sexe_error = false;
	this.length_error = false;
	this.weight_error = false;
	this.desired_weight_error = false;
	this.exercise_error = false;
	this.duplicate_key_error = false;
	this.technical_error = false;	
}

function readSettings(settings, db, next) {
	var errors = new Errors();
	settingsDAO.readSettings(settings, db, function(resultCode, userSettings) {
		if (resultCode === "SUCCESS") {
			errors['success'] = true;
			var returnMessage = settingsResultMessage(errors, userSettings);
			next(returnMessage);
		} else {
			errors['technical_error'] = true;
			var returnMessage = settingsResultMessage(errors);
			next(returnMessage);
		}
	});
};

function storeSettings(settings, db, next) {
	var errors = new Errors();
	var currentYear = new Date().getFullYear();
	var yearOfBirth = settings.dateOfBirth.substr(0,4);
	var age = currentYear - yearOfBirth;
	if (settings.sexe == "M") {
		settings.BMR = 88.362 + (13.397 * parseFloat(settings.weight)) + (4.799 * parseFloat(settings.length)) - (5.677 * age)
	} else {
		settings.BMR = 447.593 + (9.247 * parseFloat(settings.weight)) + (3.098 * parseFloat(settings.length)) - (4.330 * age)
	}
	settings.TDEE = settings.BMR * parseFloat(settings.exercise);
	
	if (settingsValidation(settings, errors)) {
		settingsDAO.createSettings(settings, db, function(resultCode, userSettings) {
			if (resultCode) {
				if (resultCode === "SUCCESS") {
					errors['success'] = true;
					var returnMessage = settingsResultMessage(errors, userSettings);
					next(returnMessage);
				} else if (resultCode === "DUPLICATE_KEY_ERROR") {
					errors['duplicate_key_error'] = true;
					var returnMessage = settingsResultMessage(errors);
					next(returnMessage);						
				} else {
					errors['technical_error'] = true;
					var returnMessage = settingsResultMessage(errors);
					next(returnMessage);	
				}
			};
		});			
	}
};

function updateSettings(settings, db, next) {
	var errors = new Errors();
	var storedSettings;
	this.readSettings(settings, db, function(result) {
		if (result.messages[0].messageType === "SUCCESS") {
			storedSettings = result;
			if (!settings.firstName) {
				settings.firstName = storedSettings.firstName;
			}
			if (!settings.lastName) {
				settings.lastName = storedSettings.lastName;
			}			
			if (!settings.dateOfBirth) {
				settings.dateOfBirth = storedSettings.dateOfBirth;
			}
			if (!settings.sexe) {
				settings.sexe = storedSettings.sexe;
			}
			if (!settings.length) {
				settings.length = storedSettings.length;
			}
			if (!settings.weight) {
				settings.weight = storedSettings.weight;
			}
			if (!settings.desiredWeight) {
				settings.desiredWeight = storedSettings.desiredWeight;
			}
			if (!settings.exercise) {
				settings.exercise = storedSettings.exercise;
			}
			if (!settings.reduceTDEE) {
				settings.reduceTDEE = storedSettings.reduceTDEE;
			}
			var currentYear = new Date().getFullYear();
			var yearOfBirth = settings.dateOfBirth.substr(0,4);
			var age = currentYear - yearOfBirth;
			if (settings.sexe == "M") {
				settings.BMR = parseInt(88.362 + (13.397 * parseFloat(settings.weight)) + (4.799 * parseFloat(settings.length)) - (5.677 * age))
			} else {
				settings.BMR = parseInt(447.593 + (9.247 * parseFloat(settings.weight)) + (3.098 * parseFloat(settings.length)) - (4.330 * age))
			}
			settings.TDEE = parseInt(settings.BMR * parseFloat(settings.exercise));
			var reduction = (settings.TDEE / 100) * settings.reduceTDEE;
			settings.targetKcal = parseInt(settings.TDEE - reduction);
		
			if (settingsValidation(settings, errors)) {
				settingsDAO.updateSettings(settings, db, function(resultCode, userSettings) {
					if (resultCode) {
						if (resultCode === "SUCCESS") {
							settingsDAO.readSettings(settings, db, function(resultCode, userSettings) {
								if (resultCode === "SUCCESS") {
									errors['success'] = true;
									var returnMessage = settingsResultMessage(errors, userSettings);
									next(returnMessage);
								} else {
									errors['technical_error'] = true;
									var returnMessage = settingsResultMessage(errors);
									next(returnMessage);
								}
							});
						} else {
							errors['technical_error'] = true;
							var returnMessage = settingsResultMessage(errors);
							next(returnMessage);	
						}
					};
				});			
			};
		}
	});
};

function settingsValidation(settings, errors) {
	var NUMERIC_RE = /^{[0-9]+:[0-9]+:[0-9]+}$/;
	var DATE_RE = /^(19|20)\d\d[- .](0[1-9]|1[012])[- .](0[1-9]|[12][0-9]|3[01])$/;
	var noErrors = true;

	if (settings.dateOfBirth) {
		if (settings.dateOfBirth != "") {		
			if (!DATE_RE.test(settings.dateOfBirth)) {
				errors['birthday_error'] = true;
				noErrors = false;
			}
		}
	}
	
	if (settings.sexe) {	
		if (settings.sexe != "") {		
			if (settings.sexe !== "M" && settings.sexe !== "F") {
				errors['sexe_error'] = true;
				noErrors = false;
			}
		} else {
			errors['sexe_error'] = true;
			noErrors = false;			
		}
	} else {
		errors['sexe_error'] = true;
		noErrors = false;
	}

	if (settings.length) {	
		if (settings.length != "") {
			if (!IsNumeric(settings.length)) {
				errors['length_error'] = true;
				noErrors = false;
			}
		} else {
			errors['length_error'] = true;
			noErrors = false;
		}
	} else {
		errors['length_error'] = true;
		noErrors = false;
	}

	if (settings.weight) {	
		if (settings.weight != "") {		
			if (!IsNumeric(settings.weight)) {
				errors['weight_error'] = true;
				noErrors = false;
			}
		}
	} else {
		errors['weight_error'] = true;
		noErrors = false;
	}
	
	if (settings.desiredWeight) {	
		if (settings.desiredWeight != "") {		
			if (!IsNumeric(settings.desiredWeight)) {
				errors['desired_weight_error'] = true;
				noErrors = false;
			}
		}
	} else {
		errors['desired_weight_error'] = true;
		noErrors = false;
	}

	if (settings.exercise) {	
		if (settings.exercise != "") {		
			if (!include([1.2, 1.375, 1.55, 1.725, 1.9], parseFloat(settings.exercise))) {
				errors['exercise_error'] = true;
				noErrors = false;
			}
		}
	} else {
		errors['exercise_error'] = true;
		noErrors = false;
	}		
	
	function include(arr, obj) {
		for(var i=0; i<arr.length; i++) {
			if (arr[i] == obj) return true;
		}
	}
	
	function IsNumeric(input) {
		return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
	}
	
	return noErrors;		
};

function settingsResultMessage(errors, userSettings) {
	var	data = {};
	var messages = [] 
	var message;
	
	if (userSettings) {
		data = userSettings;
	}
	data.messages = messages;
	
	if (errors['success'] === true) {
		message = {	
			"messageType" : "SUCCESS",
			"messageCode" : "SETTINGS_0000",
			"messageText" : "Alles ok"
		};		
		messages.push(message);	
	}			
	if (errors['birthday_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0001",
			"messageText" : "Fout in geboortedatum"
		};
		messages.push(message);	
	}
	if (errors['sexe_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0002",
			"messageText" : "Fout in geslacht"
		};
		messages.push(message);	
	}
	if (errors['length_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0003",
			"messageText" : "Fout in lengte"
		};
		messages.push(message);	
	}
	if (errors['weight_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0004",
			"messageText" : "Fout in gewicht"
		};
		messages.push(message);	
	}
	if (errors['desired_weight_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0004",
			"messageText" : "Fout in gewenst gewicht"
		};
		messages.push(message);	
	}
	
	if (errors['exercise_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0004",
			"messageText" : "Fout in lichaamsbeweging"
		};
		messages.push(message);	
	}
	
	if (errors['technical_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0005",
			"messageText" : "Technische fout"
		};
		messages.push(message);	
	}		
	if (errors['duplicate_key_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "SETTINGS_0006",
			"messageText" : "settings bestaan al"
		};
		messages.push(message);	
	}		
	return data;
};

exports.readSettings = readSettings;
exports.storeSettings = storeSettings;
exports.updateSettings = updateSettings;
