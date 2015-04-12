var db = require("./db.js");


var concertsDB = null;
var seatsDB = null;
var dbReady = false;

exports.search = function(query, callback) {
	var re = new RegExp("tónleikar","i");
	if(dbReady)
		concertsDB.find({name: re},callback);
		//concertsDB.find().where("eventDateName LIKE ?", ['Samsöngur á föstudegi']).run(callback);

};


db.onReady(function() {
		console.log('calling back');
		dbReady = true;

		concertsDB = db.Concerts;
		seatsDB = db.Seats;

		exports.search({id: 2}, function(err, results) {
			if(err)
				console.log(err);
			else {
				console.log(results);
				//console.log('eventHalName:'+ results[0].eventHallName);
			}
		});

	}
);