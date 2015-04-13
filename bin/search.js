var db = require("./db.js");


var concertsDB = null;
var seatsDB = null;
var dbReady = false;

exports.search = function(query, callback) {
	var re = new RegExp("tónleikar","i");
	var searchTerm = "SELECT * FROM concerts WHERE";
	if(dbReady)
	{
		query.term = "Björtuloft";
		console.log(query.term);
		if (query.term)
		{
			searchTerm += " eventhallname LIKE %"+query.term+"% OR name LIKE %"+query.term+"% OR dateshow LIKE %";
			searchTerm += ""+query.term+"% OR usergroupname LIKE %"+query.term+"% OR eventhallname LIKE %"+query.term;
			searchTerm += "% OR price LIKE %"+query.term+"%";
		}
		if (query.date)
		{
			searchTerm += " AND dateshow LIKE %"+query.date+"%";
		}
	}
		db.db.driver.execQuery(searchTerm, callback);
		/*db.db.driver.execQuery("SELECT * FROM concerts WHERE  eventhallname LIKE '%Björtuloft%'",
			['eventDateName'], callback);*/
		//concertsDB.find().where("id LIKE ??", [1]).run(callback);
	//concertsDB.find({name: re},callback);

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