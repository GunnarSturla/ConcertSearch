var express = require('express');
var router = express.Router();
var cool = require('cool-ascii-faces');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(cool());
  res.render('index', {
  	title: 'Concert Search',
  	query: req.query.q
  });
  /*res.send({
  	users: ['Will', "Laura"]
  });*/
});

module.exports = router;