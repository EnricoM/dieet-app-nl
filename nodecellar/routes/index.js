var	SessionRoute = require('../server/sessionRoute');
var	SettingsRoute = require('../server/settingsRoute');
var	NutrientsRoute = require('../server/nutrientsRoute');
var	DiaryRoute = require('../server/diaryRoute');
	
module.exports = exports = function(app, db) {

    var sessionRoute = new SessionRoute(db);
	var settingsRoute = new SettingsRoute(db);
	var nutrientsRoute = new NutrientsRoute(db);
	var diaryRoute = new DiaryRoute(db);
	
	function checkAuth(req, res, next) {
		sessionRoute.verifyLoggedOn(req, res, function(result) {
			if (result.resultCode !== "SUCCESS") {
				res.clearCookie('session', { path: '/' }); 
				res.send(401);
				next("NO SUCCESS");
			} else {
				req.param.email = result.email;
				next("SUCCESS");
			}
		});
	};
	
	app.post('/registration', function(req, res) {
		sessionRoute.verifyLoggedOn(req, res, function(result) {
			if (result.resultCode !== "SUCCESS") {
				sessionRoute.registerUser(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			} else {
				sessionRoute.logoffUser(req, res, function(result) {
					res.clearCookie('session', { path: '/' }); 
					res.send(200);
				});				
			}
		});
	});
	
	app.post('/session', function(req, res) {
		sessionRoute.logonUser(req, res, function(result) {
			res.send(200, JSON.stringify(result));
		});	
	});
	
	app.del('/session', function(req, res) {
		sessionRoute.logoffUser(req, res, function(result) {
			res.clearCookie('session', { path: '/' }); 
			res.send(200);
		});	
	});
	
	app.post('/settings', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				settingsRoute.storeSettings(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});
	
	app.get('/settings', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				settingsRoute.readSettings(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});
	
	app.put('/settings', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				settingsRoute.updateSettings(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});	
	
	app.get('/categories', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				nutrientsRoute.readCategories(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});

	app.get('/products', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				nutrientsRoute.readProducts(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});

	app.get('/diaries', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				diaryRoute.readDiary(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});

	app.post('/diaries', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				diaryRoute.createDiary(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});
	
	app.put('/diaries', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				diaryRoute.updateDiary(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});
	
	app.del('/diaries', function(req, res) {
		checkAuth(req, res, function(result) {
			if (result === "SUCCESS") {
				diaryRoute.removeDiary(req, res, function(result) {
					res.send(200, JSON.stringify(result));
				});
			}
		});
	});
	
}
