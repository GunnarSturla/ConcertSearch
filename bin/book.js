var db = require("./db.js");


var concertsDB = null;
var seatsDB = null;
var dbReady = false;

exports.getAvailableSeats = function(concertId, callback)
{
	if (dbReady)
	{
		//var searchTerm = "SELECT * FROM seats";// WHERE concertid = 2";//+concertId.id;
		//console.log(searchTerm);
		//db.db.driver.execQuery(searchTerm, callback);
		//seatsDB.find({concertid: concertId}, callback);

		var hallSize = 5;
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

		function returnBuilder(callback)
		{
			console.log('returnBuilder: '+ hallSize);

			return function(err, result) {
				if(err) callback(err, '');
				console.log('return function: '+result.length+ hallSize);
				console.log(result);

				if(result) {
					for (var i = 0; i < result.length; i++)
					{
						console.log("result[i]"+result[i].available);
						//console.log('result.seat: '+result[i].seatno + ' row: '+result[i].rowno);
						console.log("seatno "+ result[i].seatno + " rowno "+ result[i].rowno);

						if(result[i].available) {
							console.log("i " + i);
							returnArray[i%10][Math.floor(i/10)] = true;
						}
						console.log(returnArray);
						seatCount++;
						if(seatCount === hallSize*hallSize) {
							callback(returnArray);
						}

					}

				} else {
					callback('No concert found by that id', '');
				}
			}
		};


		seatsDB.find({concertid: concertId}, returnBuilder(callback));

	}
}

exports.book = function(concertId, seatArr, callback) {

	seatChecker = function(callback) {
		console.log('oðiajsd');
		return function(err, results) {

		}
	}

	if(dbReady) {
		seatsDB.find({concertid: concertId},  seatChecker(callback))
	} else
		callback('database not ready!','');
}

db.onReady(function() {
		console.log('calling back');
		dbReady = true;

		concertsDB = db.Concerts;
		seatsDB = db.Seats;

		qArr = [[1, 1, 1]
				[2, 3, 4]];

		exports.getAvailableSeats(2, function(err, results) {
			if(err) console.log(err);
			console.log(results[0].available);
		});

	}
);