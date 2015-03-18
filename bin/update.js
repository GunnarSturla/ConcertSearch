var http = require('http');
var orm = require("orm");

exports = module.exports = {};

exports.update = function() {

};

exports.getApisJson = function(retCallback) {
	var options = {
		host: 'apis.is',
		path: '/concerts'
	};

	var callback = function(response) {
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			retCallback(JSON.parse(str));
		});
	};

	http.request(options, callback).end();
};

exports.checkJson = function(concerts, callback)
{
	var noRounds = 0;
	var noChecks = concerts.lenth;
	var returnArray = [];

	function checker(err, result) {
		if(err) {
			callback(err, false);
		} else if (result) {
			// concert is in database, move along
		} else {
			returnArray.push(concerts[noRounds]);
			//console.log(concerts[noRounds]);
			//console.log(returnArray[0].eventDateName);
		}
		noRounds++;
		if(noRounds == noChecks) {
			callback('', returnArray);
		}
	}

	for(var i = 0; i < concerts.length; i++) {
		this.checkOne(concerts[i], checker);
	}
}



exports.checkOne = function(concert, callback) {
	/*var dbURL = 'postgres://asxpfklbktfkgn:i4KR-MrAgZzbgCRc4uj7uN8ZqI@ec2-50-17-181-147.compute-1.amazonaws.com:5432/dcgh0u24tvps9v?ssl=true';
	var db = orm.connect(dbURL);
	db.on('connect', function(err) {
		if (err) return console.error('Connection error: ' + err);

		var Concert = db.define("concert", {
			concertId		: integer,
			eventDateName  	: text,
			name		   	: text,
			dateShow        : text,
			userGroupname   : text,
			eventHallName	: text,
			price			: integer
		});

		callback(Concert.exists({eventDateName : concert.eventDateName, dateOfShow: concert.dateOfShow}));

	});*/
	if(concert.eventDateName == "Siggi litli sörensen") {
		callback('',true);
	} else {
		callback('',false);
	}
};
