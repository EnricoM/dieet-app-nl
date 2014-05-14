var nutrientsHandler = require('./nutrientsHandler');

function NutrientsRoute(db) {
	
	this.readProducts = function (req, res, next) {
		var product = {
			"_id" : req.query._id,
			"category" : req.query.category,
			"product" : req.query.product
		}
		nutrientsHandler.readProducts(product, db, function(returnMessage) {
			next(returnMessage);
		});
	};
	
	this.readCategories = function (req, res, next) {
		nutrientsHandler.readCategories(db, function(returnMessage) {
			next(returnMessage);
		});
	};
};
module.exports = NutrientsRoute;