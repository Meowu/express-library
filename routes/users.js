var express = require('express');
var router = express.Router();
const genre = require('../models/genre')

/* GET users listing. */
router.get('/', function(req, res, next) {
  // console.log()
  const _genre = new genre({
    name: 'Pride and Prejudice'
  })
  _genre.save(function (err) {
    if (err) {
      return console.log(err)
    }
    console.log("Add a new book.")
  })
  res.send('respond with a resource');
});

module.exports = router;
