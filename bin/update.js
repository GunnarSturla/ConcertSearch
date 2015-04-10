var http = require('http');
var db = require("./db.js");

var concertsDB = null;
var seatsDB = null;
exports = module.exports = {};

/********************************************************************************
 * 																				*
 *		  _        _									  _        _			*
 *		_| |      | |_									_| |      | |_			*
 *		|_ \      / _|									|_ \      / _|			*
 *		  \ \____/ /									  \ \____/ /			*
 * 		   \/_  _\/	 	 ****************************	   \/_  _\/				*
 *		    \*  */  	/*		WELCOME TO....		*	    \*  */  		   /*
 *		     |/\|		 *		CALLBACK HELL!!!	*	     |/\|				*
 *	 	     /__\		 *							*	     /__\				*
 *		    /\__/\		 ****************************	    /\__/\				*
 *		  _/ /  \ \_									  _/ /  \ \_			*
 *		 |_ /    \ _|									 |_ /    \ _|			*
 *		  |_|    |_|									  |_|    |_|			*
 *	  																			*
 ********************************************************************************/


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
			//console.log(str);
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

	var number = 0;
	for(var i = 0; i < noChecks; i++) {
		console.log('checking concert '+i);
		console.log(concerts[i]);
		createIt = function(i) {
			if(!i) i = 0;

			return function(err, concertExists) {
				if(!concertExists) {
					console.log('adding ' +concerts[i].eventDateName);
					var price = Math.floor(Math.random()*20+1)*1000
					// Verð á bilinu 1000 til 20000
					concertsDB.create([{
						eventDateName: concerts[i].eventDateName,
						name: concerts[i].name,
						dateOfShow: concerts[i].dateShow,
						userGroupName: concerts[i].userGroupName,
						eventHallName: concerts[i].eventHallName,
						imageSource: concerts[i].imageSource,
						price: price
					}], function(err, items) {
						if(err) return printError(err);
						console.log('wrote to db: ' + items[0].eventDateName+' price: '+items[0].price);
					})
				}
				return true;
			}
		};
		concertsDB.exists({eventDateName : concerts[i].eventDateName, dateOfShow: concerts[i].dateOfShow}, createIt(i));
	}
	return true;
};
/*
                              .___.
          /)               ,-^     ^-.
         //               /           \
.-------| |--------------/  __     __  \-------------------.__
|WMWMWMW| |>>>>>>>>>>>>> | />>\   />>\ |>>>>>>>>>>>>>>>>>>>>>>:>
`-------| |--------------| \__/   \__/ |-------------------'^^
         \\               \    /|\    /
          \)               \   \_/   /
                            |       |
                            |+H+H+H+|
                            \       /
                             ^-----^
 */

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
			return true;
			});
		return true;
		}
);