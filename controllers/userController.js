
const User = require('../models/user')

exports.user_vertify = function(req, res, next) {
  if (!req.session.user) {
    console.log('未登录用户')
    res.redirect('/catalog/signin')
  }
  next()
}
exports.user_signin_get = function(req, res ,next) {
  res.render('user_sign', {title: 'Signin', signin: true })
}

exports.user_signin_post = function(req, res ,next) {

}

exports.user_signup_get = function(req, res, next) {

}

exports.user_signup_post = function(req, res, next) {

}

exports.user_profile_get = function(req, res, next) {

}

exports.user_profile_post = function(req, res, next) {
  
}