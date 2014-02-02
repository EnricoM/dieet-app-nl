ObjectID = require('mongodb').ObjectID;

function readDiary(diary, db, next) {
	var diaries = db.collection("diaries");
	var email = diary.email;
	var diaryDate = diary.diaryDate;
	var query = { $and: [ { 'email' : email } , { 'diaryDate' : diaryDate } ] };
	diaries.find(query).sort({ product : 1 }).toArray(function(err, document) {
		if(err) {
			next("DB_ERROR", null);
		} else if (document) {
			next("SUCCESS", document);
		} else {
			next("NOT_FOUND", null);
		};
	})
}

function createDiary(diary, db, next) {
	var diaries = db.collection("diaries");
	diaries.insert(diary, function(err, document) {
		if(err) {
			if(err.code === 11000) {
				next("DUPLICATE_KEY_ERROR", null);
			} else {
				next("DB_ERROR", null);
			}
		} else if (document && document[0]) {
			next("SUCCESS", document[0]);
		} else {
			next("UNKNOWN_ERROR", null);
		};
	})
}

function deleteDiary(diary, db, next) {
	var diaries = db.collection("diaries");
	var query = {'_id': new ObjectID(diary._id)};
	console.log(query);
	diaries.remove(query, function(err, document) {
		console.log(err, document);
		if(err) {
			next("DB_ERROR", null);
		} else if (document) {
			next("SUCCESS");
		} else {
			next("NOT_FOUND", null);
		};
	})
};

exports.readDiary = readDiary;
exports.createDiary = createDiary;
exports.deleteDiary = deleteDiary;
