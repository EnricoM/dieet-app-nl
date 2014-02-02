var nutrientsDAO = require('./nutrientsDAO');

function Errors() {
	this.success = false;
	this.technical_error = false;
	this.not_found_error = false;
}

function readProducts(product, db, next) {
	var errors = new Errors();
	nutrientsDAO.readProducts(product, db, function(resultCode, products) {
		if (resultCode === "SUCCESS") {
			errors['success'] = true;
			var returnMessage = productsResultMessage(errors, products);
			next(returnMessage);
		} else if (resultCode === "NOT_FOUND") {
			errors['not_found_error'] = true;
			var returnMessage = productsResultMessage(errors);
			next(returnMessage);
		} else {
			errors['technical_error'] = true;
			var returnMessage = productsResultMessage(errors);
			next(returnMessage);
		}
	});
};
	
function readCategories(db, next) {
	var errors = new Errors();
	nutrientsDAO.readCategories(db, function(resultCode, categories) {
		if (resultCode === "SUCCESS") {
			errors['success'] = true;
			var returnMessage = categoriesResultMessage(errors, categories);
			next(returnMessage);
		} else {
			errors['technical_error'] = true;
			var returnMessage = categoriesResultMessage(errors);
			next(returnMessage);
		}
	});
};
	
function categoriesResultMessage(errors, categories) {
	var	data = {
		"categories" : categories,
		"messages" : []
	};
	var message;
		
	if (errors['success'] === true) {
		message = {	
			"messageType" : "SUCCESS",
			"messageCode" : "CATEGORIES_0000",
			"messageText" : "Alles ok"
		};		
		data.messages.push(message);	
	}			

	if (errors['technical_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "CATEGORIES_0001",
			"messageText" : "Technische fout"
		};
		data.messages.push(message);	
	}		

	return data;
};
	
function productsResultMessage(errors, products) {
	var	data = {
		"products" : products,
		"messages" : []
	};
	var message;
		
	if (errors['success'] === true) {
		message = {	
			"messageType" : "SUCCESS",
			"messageCode" : "PRODUCTS_0000",
			"messageText" : "Alles ok"
		};		
		data.messages.push(message);	
	}			

	if (errors['technical_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "PRODUCTS_0001",
			"messageText" : "Technische fout"
		};
		data.messages.push(message);	
	}		

	if (errors['not_found_error'] === true) {
		message = {	
			"messageType" : "ERROR",
			"messageCode" : "PRODUCTS_0002",
			"messageText" : "Geen producten gevonden"
		};
		data.messages.push(message);	
	}		
	return data;
};	

exports.readCategories = readCategories;
exports.readProducts = readProducts;