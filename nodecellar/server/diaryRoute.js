var diaryHandler = require('./diaryHandler');

function DiaryRoute(db) {
	
	this.readDiary = function (req, res, next) {
		var diary = {
			"email" : req.param.email,
			"diaryDate" : req.query.diaryDate
		}
		diaryHandler.readDiary(diary, db, function(returnMessage) {
			next(returnMessage);
		});
	};
	
	this.createDiary = function (req, res, next) {
		var diary = {
			"email" : req.param.email,
			"diaryDate" : req.body.diaryDate,
			"productId" : req.body.productId,
			"totalQuantity" : req.body.totalQuantity
		};
		diaryHandler.createDiary(diary, db, function(returnMessage) {
			next(returnMessage);
		});
	};
	
	this.removeDiary = function (req, res, next) {
		var diary = {
			"email" : req.param.email,
			"diaryDate" : req.body.diaryDate,
			"_id" : req.body._id
		};
		diaryHandler.removeDiary(diary, db, function(returnMessage) {
			next(returnMessage);
		});
	};
};

module.exports = DiaryRoute;