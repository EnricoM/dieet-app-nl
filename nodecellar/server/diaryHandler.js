var diaryDAO = require('./diaryDAO');
var	nutrientsHandler = require('../server/nutrientsHandler');
var	settingsHandler = require('../server/settingsHandler');

function Errors() {
	this.success = false;
	this.technical_error = false;
	this.not_found_error = false;
	this.date_error = false;
	this.quantity_error = false;
	this._id_error = false;
}

function readDiary(diary, db, next) {
	var errors = new Errors();
	var returnMessage;
	if (diaryReadValidation(diary, errors)) {
		var settings = {
			"email" : diary.email
		}
		settingsHandler.readSettings(settings, db, function(returnMessage) {
			if (returnMessage && returnMessage.messages && returnMessage.messages[0] && returnMessage.messages[0].messageType === "SUCCESS") {
				diaryDAO.readDiary(diary, db, function(resultCode, diaryDocument) {
					if (resultCode === "SUCCESS") {
						var actuals = {};
						var totals = [];
						totals.push ( { "type" : "BMR", "total" : returnMessage.BMR} );
						totals.push ( { "type" : "TDDE", "total" : returnMessage.TDEE} );
						totals.push ( { "type" : "DOEL", "total" : returnMessage.targetKcal} );	
						if (diaryDocument && diaryDocument.length) {
							var j = diaryDocument.length;
							var totalKcal = 0, totalProtein =0, totalCarbon = 0, totalFat = 0; 
							for(var i=0; i<j; i++) {
								var test = diaryDocument[i];
								totalKcal = totalKcal + parseInt(test.totalKcal);
								totalProtein = totalProtein + parseFloat(diaryDocument[i].totalEiwit);
								totalCarbon = totalCarbon + parseFloat(diaryDocument[i].totalKoolh);
								totalFat = totalFat + parseFloat(diaryDocument[i].totalVet);
								//actuals = { "type" : "TOTAL",  "totalKcal" : totalKcal, "totalProtein" : totalProtein.toFixed(2), "totalCarbon" : totalCarbon.toFixed(2), "totalFat" : totalFat.toFixed(2) };
							}
							actuals = { "type" : "TOTAL",  "totalKcal" : totalKcal, "totalProtein" : totalProtein.toFixed(2), "totalCarbon" : totalCarbon.toFixed(2), "totalFat" : totalFat.toFixed(2) };						
						} else {
							actuals = { "type" : "TOTAL",  "totalKcal" : 0, "totalProtein" : 0, "totalCarbon" : 0, "totalFat" : 0 };						
						}
						errors.success = true;
						returnMessage = diaryResultMessage(errors, diaryDocument, totals, actuals);
						next(returnMessage);
						return;
					} else {
						errors.technical_error = true;
						returnMessage = diaryResultMessage(errors, null );
						next(returnMessage);
						return;
					}
				});
			} else {
				// abort... abort
			}
		})
	
	} else {
		returnMessage = diaryResultMessage(errors);
		next(returnMessage);
		return;
	}	
};

function createDiary(diary, db, next) {
	var errors = new Errors();
	
	if (diaryCreateValidation(diary, errors)) {
		var inputProduct = {
			"_id" : diary.productId,
			"category" : null,
			"product" : null
		}
		var product = {};
		nutrientsHandler.readProducts(inputProduct, db, function(result) {
			if (result && result.messages && result.messages[0] && result.messages[0].messageType === "SUCCESS") {
				product.email = diary.email
				product.diaryDate = diary.diaryDate;
				product.category = result.products.category;
				product.product = result.products.product;
				product.totalQuantity = diary.totalQuantity;
				product.totalKcal = ((diary.totalQuantity / result.products.Defaulthoev) * result.products.Merken[0].Kcal).toFixed(0);
				product.totalEiwit = ((diary.totalQuantity / result.products.Defaulthoev) * result.products.Merken[0].Eiwit).toFixed(2);
				product.totalKoolh = ((diary.totalQuantity / result.products.Defaulthoev) * result.products.Merken[0].Koolh).toFixed(2);
				product.totalVet = ((diary.totalQuantity / result.products.Defaulthoev) * result.products.Merken[0].Vet).toFixed(2);
				diaryDAO.createDiary(product, db, function(resultCode, diaryDocument) {
					if (resultCode === "SUCCESS") {
						errors['success'] = true;
						var returnMessage = diaryResultMessage(errors, diaryDocument);
						next(returnMessage);
					} else {
						errors['technical_error'] = true;
						var returnMessage = diaryResultMessage(errors);
						next(returnMessage);
					}
				});
			}
		});
	} else {
		errors.technical_error = true;
		var returnMessage = diaryResultMessage(errors);
		next(returnMessage);
	}	
};

function removeDiary(diary, db, next) {
	var errors = new Errors();
	
	if (diaryRemoveValidation(diary, errors)) {
		diaryDAO.deleteDiary(diary, db, function(resultCode, diaryDocument) {
			if (resultCode === "SUCCESS") {
				errors['success'] = true;
				var returnMessage = diaryResultMessage(errors, diaryDocument);
				next(returnMessage);
			} else {
				errors['technical_error'] = true;
				var returnMessage = diaryResultMessage(errors);
				next(returnMessage);
			}
		});
	} else {
		errors.technical_error = true;
		var returnMessage = diaryResultMessage(errors);
		next(returnMessage);
	}	
};

function diaryReadValidation(diary, errors) {
	var NUMERIC_RE = /^{[0-9]+:[0-9]+:[0-9]+}$/;
	var DATE_RE = /^(19|20)\d\d[- .](0[1-9]|1[012])[- .](0[1-9]|[12][0-9]|3[01])$/;
	var noErrors = true;
	if (diary.diaryDate) {
		if (diary.diaryDate != "") {		
			if (!DATE_RE.test(diary.diaryDate)) {
				errors['date_error'] = true;
				noErrors = false;
			}
		} else {
			errors['date_error'] = true;
			noErrors = false;
		}
	} else {
		errors['date_error'] = true;
		noErrors = false;
	}
	
	return noErrors;
}

function diaryCreateValidation(diary, errors) {
	var NUMERIC_RE = /^{[0-9]+:[0-9]+:[0-9]+}$/;
	var DATE_RE = /^(19|20)\d\d[- .](0[1-9]|1[012])[- .](0[1-9]|[12][0-9]|3[01])$/;
	var noErrors = true;

	if (diary.diaryDate) {
		if (diary.diaryDate !== "") {		
			if (!DATE_RE.test(diary.diaryDate)) {
				errors.date_error = true;
				noErrors = false;
			}
		} else {
			errors.date_error = true;
			noErrors = false;
		}
	} else {
		errors.date_error = true;
		noErrors = false;
	}
	
	if (diary.productId) {
		if (diary.productId === "") {		
			errors_id_error = true;
			noErrors = false;
		}
	} else {
		errors_id_error = true;
		noErrors = false;
	}
	
	if (diary.totalQuantity !== parseInt(diary.totalQuantity)) {
		errors.totalQuantity_error = true;
		noErrors = false;
	}
	return noErrors;
}	

function diaryRemoveValidation(diary, errors) {
	var DATE_RE = /^(19|20)\d\d[- .](0[1-9]|1[012])[- .](0[1-9]|[12][0-9]|3[01])$/;
	var noErrors = true;

	if (diary.diaryDate) {
		if (diary.diaryDate !== "") {		
			if (!DATE_RE.test(diary.diaryDate)) {
				errors.date_error = true;
				noErrors = false;
			}
		} else {
			errors.date_error = true;
			noErrors = false;
		}
	} else {
		errors.date_error = true;
		noErrors = false;
	}
	
	return noErrors;
}	

function diaryResultMessage(errors, diaryDocument, totals, actuals) {
	var	data = {
		actuals : null,
		result : [],
		messages : [],
		totals : null
	};
	var messages = [] 
	var message;
	
	if (diaryDocument) {
		data.result = diaryDocument;
	}
	
	if (totals) {
		data.totals = totals;
	}
	
	if (actuals) {
		data.actuals = actuals;
	}

	data.messages = messages;
	
	if (errors.success === true) {
		message = {	
			"messageType" : "SUCCESS",
			"messageCode" : "DIARY_0000",
			"messageText" : "Alles ok"
		};		
		messages.push(message);	
	}			
	
	if (errors.technical_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "DIARY_0001",
			"messageText" : "Technische fout"
		};
		messages.push(message);	
	}		
	
	if (errors.duplicate_key_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "DIARY_0002",
			"messageText" : "diary bestaat al"
		};
		messages.push(message);	
	}		
	
	if (errors.date_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "DIARY_0003",
			"messageText" : "Foute datum"
		};
		messages.push(message);	
	}	
	
	if (errors.totalQuantity_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "DIARY_0005",
			"messageText" : "Foute hoeveelheid"
		};
		messages.push(message);	
	}
	
	if (errors.date_error === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "DIARY_0003",
			"messageText" : "Foute datum"
		};
		messages.push(message);	
	}
	
	return data;
};	

exports.readDiary = readDiary;
exports.createDiary = createDiary;
exports.removeDiary = removeDiary;
