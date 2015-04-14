var http = require('http');
var db = require("./db.js");

var concertsDB = null;
var seatsDB = null;

var dbReady = false;
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


exports.update = function(callback) {

	if(dbReady) {
		getApisData(function (apisData) {
			console.log("db ready, let's do dis");
			addConcertsIfMissing(apisData, callback);
		});

	} else {
		console.log('Connection to database not established');
		callback(false);
	}
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
		createIt = function(i) {
			if(!i) i = 0;

			return function(err, concertExists) {
				console.log('concertExists: ' + concertExists);

				if(!concertExists) {
					console.log('adding ' +concerts[i].eventDateName);
					var price = Math.floor(Math.random()*20+1)*1000
					// Verð á bilinu 1000 til 20000
					concertsDB.create([{
						eventdatename: concerts[i].eventDateName,
						name: concerts[i].name,
						dateofshow: concerts[i].dateOfShow,
						usergroupname: concerts[i].userGroupName,
						eventhallname: concerts[i].eventHallName,
						imagesource: concerts[i].imageSource,
						price: price
					}], function(err, items) {
						if(err) return printError(err);
						console.log('wrote to db: ' + items[0].eventdatename+' price: '+items[0].price);


						var noRows = 5;
						var noSeats = 5;
						var seatArr = [];
						for(var j = 0; j < noRows; j++) {
							for(var k = 0; k < noSeats; k++) {
								//console.log('j:'+j+' k:'+k);
								var seat = {
									concertid: items[0].id,
									seatno: k,
									rowno: j,
									available: 1
								};
								seatArr.push(seat);
							}
						}
						console.log(seatArr);
						seatsDB.create(seatArr, function(err, items) {
							if(err) return printError(err);
							console.log('Setti '+items.length+' seats í db tengt');
							//console.log(items);
						});
					})
				}
				//return true;
			}
		};
		concertsDB.exists({eventdatename : concerts[i].eventDateName, dateofshow: concerts[i].dateOfShow}, createIt(i));
		callback(true);
	}
	// Hér vantar callback();
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
		dbReady = true;
		exports.update(function() { return true; });
		concertsDB = db.Concerts;
		seatsDB = db.Seats;
	return true;
	}
);