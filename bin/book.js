var db = require("./db.js");


var concertsDB = null;
var seatsDB = null;
var dbReady = false;

exports.getAvailableSeats(concertId, callback)
{
	if (dbReady)
	{
		var hallSize = 10;
		var returnArray = [];
		for (var i = 0; i < hallSize; i++)
		{
			returnArray[i] = [];
			for (var j = 0; j < hallSize; j++)
			{
				returnArray[i][j] = false;
			}
		}
		var seatCount = 0;

		var returnBuilder = function (i, j, callback)
		{

			return function(err, result) {
				if(result.available) {
					returnArray[i][j] = true;
				}
				seatCount++;
				if(seatCount === hallSize*hallSize) {
					callback(returnArray);
				}
			}
		};
		for(var i = 0; i < hallSize; i++) {
			for(var i = 0; i < hallSize; i++) {
				seatsDB.find({concertid: concertId}, returnBuilder(i, j, ));

			}
		}
	}
}

exports.book = function(concertId, seatArr, callback) {

	seatChecker = function(callback) {
		console.log('oðiajsd');

		return function(err, results) {

		}
	}

	if(dbReady) {
		seatsDB.find({concertid: concertId},  )
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