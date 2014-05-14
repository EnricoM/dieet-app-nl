ObjectID = require('mongodb').ObjectID;

function readCategories(db, queryResult) {
	var categories = db.collection("categories");
	var query = {};

	categories.find(query).toArray(function(err, document) {
		if(err) {
			queryResult("DB_ERROR", null);
		} else if (document) {
			queryResult("SUCCESS", document);
		} else {
			queryResult("NOT_FOUND", null);
		};
	})
};

function readProducts(product, db, queryResult) {
	var products = db.collection("products");
	if (product.category == null || product.category == "" || product.category == undefined) {
		useCategory = "n";
	} else {
		if (product.category != "-1") {
			useCategory = "y";
		} else {
			useCategory = "a";
		}
	}
	
	if (product.product) {
		useProduct = "y";
	} else {
		useProduct = "n";
	}
	
	if (product._id) {
		useCategory = "n";
		useProduct = "n";
		useId = "y"
	} else {
		useId = "n"
	}
	
	str = useCategory + useProduct + useId;
	var query;
	var doQuery = true;
	switch(str) {
		case "ynn":
			query = { "category" : product.category };
			break;
		case "nyn":
			query = { "product" : new RegExp(product.product, 'i') };
			break;
		case "yyn":
			query = { $and : [ { "product": { '$regex' : product.product } }, { "category" : product.category } ] };
			break;
		case "ann":
			query = {};
			break;
		case "ayn":
			query = { "product" : new RegExp(product.product, 'i') };
			break;
		case "nny":
			query = { "_id" : new ObjectID(product._id) };
			break;
		default:
			doQuery = false;
			break;
	}

	if (doQuery) {
		if (str === "nny") {
			products.findOne(query, function(err, document) {
				if(err) {
					queryResult("DB_ERROR", null);
				} else if (document) {
					queryResult("SUCCESS", document);
				} else {
					queryResult("NOT_FOUND", null);
				};
			});
		} else {
			products.find(query).sort({Product:1}).toArray(function(err, document) {
				if(err) {
					queryResult("DB_ERROR", null);
				} else if (document) {
					queryResult("SUCCESS", document);
				} else {
					queryResult("NOT_FOUND", null);
				};
			})
		}
	};
};

exports.readCategories = readCategories;
exports.readProducts = readProducts;