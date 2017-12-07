var express = require('express');
var router = express.Router();
const genre = require('../models/genre') 
const user_controller = require('../controllers/userController')
const path = require('path')
const multer = require('multer')
const upload = multer({dest: path.resolve(__dirname, './public/images/avatars')})


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

/*Get reuest for signup */
router.get('/signup', user_controller.user_signup_get)

/*Post request for sginup */
router.post('/signup', upload.single('avatar'), user_controller.user_signup_post)

/*Get request for signin */
router.get('/signin', user_controller.user_signin_get)

/*Post request for signin */
router.post('/signin', user_controller.user_signin_post)

/*Get request for user home page */
router.get('/home', user_controller.user_profile_get)

/*Post request for user home page */
router.post('/home/update', user_controller.user_profile_post)
module.exports = router;
