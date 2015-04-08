var expect = require("chai").expect;
var update = require("../bin/update.js");


describe("Update", function() {
	describe("#getApisData(callback)", function(done) {
		it("should return a JSON object", function() {

			function getApisCallback(result) {
				expect(result).to.have.property('results');
				done();
			}

			update.getApisData(getApisCallback);
		});
	});

	/*describe("#addConcertsIfMissing(object)", function() {
		it("should check if all data in object is in database", function() {

		});

	});*/

	describe("#checkIfOneExists(concert, number, callback)", function() {
		it("should return false when concert is not in database", function(done) {

			function checkOneCallback(err,number, result) {
				if(!err) {
					expect(result).to.equal(false);
					done();
				}
			}

			var testConcert = {
				"eventDateName": "Gunnar á ferðalagi",
				"name":"TKTK tónleikur",
				"dateOfShow":"2015-03-17T19:00:00",
				"userGroupName":"Salurinn í Kópavogi",
				"eventHallName":"Salurinn",
				"imageSource":"http://midi.is/images/medium/1.8552.jpg"
			};

			update.checkIfOneExists(testConcert, 0, checkOneCallback);
		});
		it("should return true when a concert is already in database", function(done) {

			function checkOneCallback(err, number, result) {
				if(!err) {
					expect(result).to.equal(true);
					done();
				}
			}

			var testConcert = {
				"eventDateName": "Siggi litli sörensen",
				"name":"",
				"dateOfShow":"2015-03-17T19:00:00",
				"userGroupName":"Harpa",
				"eventHallName":"Eldborg",
				"imageSource":""
			};

			update.checkIfOneExists(testConcert, 0, checkOneCallback);
		});
	});

	describe("#addConcertsIfMissing(concerts, callback)", function(done) {
		it("should return an empty array when all concerts are in database", function () {
			function checkJsonCallback(err, result) {
				expect(result).to.equal([]);
				done();
			}

			var testConcert = {
				"eventDateName": "Siggi litli sörensen",
				"name": "",
				"dateOfShow": "2015-03-17T19:00:00",
				"userGroupName": "Harpa",
				"eventHallName": "Eldborg",
				"imageSource": ""
			};

			var testArray = [testConcert];

			update.addConcertsIfMissing(testArray, checkJsonCallback);

		});
		it("should return an array of new concerts when concerts are not in database", function (done) {

			function checkJsonCallback(err, result) {
				var testThis = result[0];
				var expected = { eventDateName: 'Helgi, persónulegi trúbadorinn',
					name: '',
					dateOfShow: '2015-03-17T19:00:00',
					userGroupName: 'Harpa',
					eventHallName: 'Eldborg',
					imageSource: '' };

				expect(testThis).to.equal(expected);
				done();
			}
			var testConcert0 = {
				"eventDateName": "Siggi litli sörensen",
				"name": "",
				"dateOfShow": "2015-03-17T19:00:00",
				"userGroupName": "Harpa",
				"eventHallName": "Eldborg",
				"imageSource": ""
			};
			var testConcert1 = {
				"eventDateName": "Helgi, persónulegi trúbadorinn",
				"name": "",
				"dateOfShow": "2015-03-17T19:00:00",
				"userGroupName": "Harpa",
				"eventHallName": "Eldborg",
				"imageSource": ""
			};

			var testArray = [testConcert0, testConcert1];

			update.addConcertsIfMissing(testArray, checkJsonCallback);
		});
	});
});