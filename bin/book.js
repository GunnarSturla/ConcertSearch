var db = require("./db.js");


var concertsDB = null;
var seatsDB = null;
var dbReady = false;

//Notkun: book.getAvailableSeats(consertId, callback);
//Fyrir: concertId er gilt Id fyrir ákveðna tónleika
//Eftir: callback(err, resultArray) err eru villuskilaboð ef upp kemur villa, annars tómt;
//			resultArray er boolean fylki með sætunum í salnum

exports.getAvailableSeats = function(concertId, callback)
{
	if (dbReady)
	{
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

			return function(err, result) {
				if(err) callback(err, '');

				if(result) {
					for (var i = 0; i < result.length; i++)
					{
						console.log("result[i] "+result[i].available);

						if(result[i].available==='1') {
							returnArray[i%5][Math.floor(i/5)] = true;
						}
						seatCount++;
						if(seatCount === result.length) {
							callback('', returnArray);
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

function generateBookingNumber()
{
	var refNumLength = 6;
	var characters = '123456789ABCDEFGHIJKLMNOPRSTUVXYZ';
	var refNum = '';
	for (var i = 0; i < refNumLength; i++)
	{
		refNum += characters.charAt(Math.floor(Math.random()*characters.length));
	}
	return refNum;
}

/*exports.book = function(concertId, seatArr, callback)
{
	callback(generateBookingNumber());
}*/


// Notkun: book.book(concertId, seatArr, callback)
// Fyrir: concertId er Id fyrir tónleika og seatArr er á forminu [[row,seat],[row,seat]...]
//Eftir: callback(err, bookingNumber) err eru villuskilaboð ef upp kemur villa, annars tómt;
//			bookingNumber er bókunarnúmerið

exports.book = function(concertId, seatArr, callback) {

	console.log('seatArr');
	console.log(seatArr);
	if(dbReady) {
		var bookingNumber = generateBookingNumber();
		var count = 0;
		var totalBookings = seatArr.length;
		function bookInDb(callback) {
			return function(err, result) {
				result[0].save({ available:  bookingNumber}, function (err) {
					if(err) callback(err,'');
					count++;
					if(count==totalBookings)
						callback('', bookingNumber);
				});
			}
		}

		for (var i = 0; i < seatArr.length; i++)
		{
			seatsDB.find({concertid: concertId, rowno: seatArr[i][0], seatno: seatArr[i][1]}, bookInDb(callback));
		}

	} else
		callback('database not ready!','');
}

db.onReady(function() {
		dbReady = true;

		concertsDB = db.Concerts;
		seatsDB = db.Seats;

		/*qArr = [[0,0],
				[0,1],
				[1,3]];*/

		/*exports.getAvailableSeats(1, function(err, results) {
			if(err) console.log(err);
			console.log(results);
		});*/
		//exports.book(1, qArr, function(err, bookingNumber){if(!err) console.log('booking success! '+ bookingNumber);});


	}
);