var http = require('http');
var db = require("./db.js");

var concertsDB = null;
var seatsDB = null;
exports = module.exports = {};

exports.update = function() {

};

getApisData = function(retCallback) {
	var options = {
		host: 'apis.is',
		path: '/concerts'
	};

	var callback = function(response) {
		var str = '';
		console.log('Getting data from Apis');
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been received, so we just print it out here
		response.on('end', function () {
			console.log(str);
			retCallback(JSON.parse(str));
		});
	};

	http.request(options, callback).end();
};

addConcertsIfMissing = function(concertsData, callback)
{
	console.log('Checking data');
	var noRounds = 0;
	var noChecks = concertsData.results.length;
	var concerts = concertsData.results;
	var returnArray = [];
	console.log(noChecks);

	function checker(err, number, result) {
		if(err) {
			callback(err, []);
		} else if (result == true) {
			// concert is in database, move along
		} else {
			returnArray.push(concerts[number]);
			//console.log(concerts[noRounds]);
			//console.log(returnArray[0].eventDateName);
		}
		noRounds++;
		if(noRounds == noChecks) {
			callback('', returnArray);
		}
	}
	var number = 0;
	for(var i = 0; i < noChecks; i++) {
		console.log('checking concert '+i);
		console.log(concerts[i]);
		concertsDB.exists({eventDateName : concerts[i].eventDateName, dateOfShow: concerts[i].dateOfShow}, function(err, concertExists) {

			if(!concertExists) {
				console.log('adding ' +concerts[number].eventDateName);
			}
			number++;
		});
	}
};


db.onReady(function() {
		console.log('calling back');
		concertsDB = db.Concerts;
		seatsDB = db.Seats;

		getApisData(function(apisData) {
				console.log("db ready, let's do dis");
				addConcertsIfMissing(apisData, function (err, unaddedConcerts){
					if(err) {
						console.log(err);
						return false;
					}
					else if (unaddedConcerts === [])
						return true;
				});
			})
		}
);