var db = require("./db.js");


var concertsDB = null;
var seatsDB = null;
var dbReady = false;

exports.book = function(concertId, seatArr, callback) {

	seatChecker = function(callback) {
		console.log('oðiajsd');

		return function(err, results) {

		}
	}

	if(dbReady) {
		seatsDB.find({concertId: concertId},  )
	} else
		callback('database not ready!','');
}

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
				console.log('eventHalName:'+ results[0].eventHallName);
			}
		});

	}
);