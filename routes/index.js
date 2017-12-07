var express = require('express');
var router = express.Router();  
const user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', user_controller.user_vertify, function(req, res, next) {
  res.redirect('/catalog')

});

module.exports = router;
