var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Concert Search',
  	query: req.query.q
  });
  /*res.send({
  	users: ['Will', "Laura"]
  });*/
});

module.exports = router;