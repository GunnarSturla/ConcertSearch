var express = require('express');
var router = express.Router();
var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
var dbresp;

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
      {
       		console.error(err);
       		dbresp = "Error " + err;
       }
      else
       {
       		dbresp = result.rows;
       	}
    });
  });


  res.render('index', {
  	title: 'Concert Search',
  	query: req.query.q,
  	db: dbresp
  });
  /*res.send({
  	users: ['Will', "Laura"]
  });*/
});

module.exports = router;