var http = require('http');
var db = require("./db.js");

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

checkIfExists = function(concerts, callback)
{
	console.log('Checking data');
	var noRounds = 0;
	var noChecks = concerts.lenth;
	var returnArray = [];

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

	for(var i = 0; i < concerts.length; i++) {
		checkIfOneExists(concerts[i], i, checker);
	}
};



checkIfOneExists = function(concert, number, callback) {
		//callback('',number, Concert.exists({eventDateName : concert.eventDateName, dateOfShow: concert.dateOfShow}));
		callback('',number, false);
};

db.onReady(getApisData(function(apisData) {
		console.log("db ready, let's do this")
		checkIfExists(apisData, function (err, unaddedConcerts){
			if(err) {
				console.log(err);
				return false;
			}
			else if (unaddedConcerts === [])
				return true;
		})
	})
);