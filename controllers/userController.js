
const User = require('../models/user')
const md5 = require('md5')

exports.user_vertify = function(req, res, next) {
    console.log(req.session.user);
  if (!req.session.user) {
    console.log('未登录用户')
    res.redirect('/users/signin')
    // return next()
  }
  next()
}
exports.user_signin_get = function(req, res ,next) {
  res.render('user_sign', {title: 'Signin', signin: true })
}

exports.user_signin_post = function(req, res ,next) {
  req.checkBody('username', 'Username is required.').notEmpty()
  req.checkBody('password', 'Password must be input.').notEmpty()

  req.sanitize('username').trim()
  req.sanitize('password').trim()

  const errors = req.validationErrors()
  if (errors) {
    res.render('user_sign', {title: 'Signin', signin: true, username: req.body.username, errors: errors})
  } else {
    User.findOne({username: req.body.username}, function(err, result) {
      // if (err) return next(err)
      if (err) throw(err)
      if (!result) {
        res.render('user_sign', {title: 'Signin', signin: true, username: req.body.username, errors: [{msg: '该用户不存在！'}]} )
      } else {
        const { password }= req.body
        if (!(md5(password) === md5(result.password))) {
          res.render('user_sign', {title: 'Signin', signin: true, username: req.body.username, errors: [{msg: '密码错误'}]} )
        } else {
          res.send('Login.')
        }
      }
      // res.send('Logged in successfully.')
    })
    
  }
}

exports.user_signup_get = function(req, res, next) {
  res.render('user_sign', {title: 'Signup', signup: true})
}

exports.user_signup_post = function(req, res, next) {
  req.checkBody('email', 'Emails must be input.').notEmpty()
  req.checkBody('username', 'Username cannot be empty.').notEmpty()
  req.checkBody('password', 'Password is required.').notEmpty()
  req.checkBody('password_again', 'Please enter your password again').notEmpty()
  req.checkBody('email', 'Invalid email.').isEmail()

  req.sanitize('email').escape()
  req.sanitize('email').trim()
  req.sanitize('username').escape()
  req.sanitize('username').trim()
  req.sanitize('password').escape()
  req.sanitize('password').trim()
  const errors = req.validationErrors()
  
  const user = new User({
    username: req.body.username,
    email: req.body.email,
  })

  const pwd = md5(req.body.password)

  if (errors) {
    res.render('user_sign', {title: 'Signup', signup: true, user: user})
  } else if (req.body.password !== req.body.password_again) {
    res.render('user_sign', {title: 'Signup', signup: true, user: user, errors: [{msg: '两次输入的密码不匹配！'}]})
  } else {
    user.password = pwd
    user.save(function(err, result) {
      if (err) return next(err)
      res.send("创建成功！")
    })
  }

}

exports.user_profile_get = function(req, res, next) {

}

exports.user_profile_post = function(req, res, next) {
  
}