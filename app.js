var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
const session = require('express-session')
const expressValidator = require('express-validator')

var index = require('./routes/index');
var users = require('./routes/users');
const catalog = require('./routes/catalog');
const user_controller = require('./controllers/userController')
var book_controller = require('./controllers/bookController');
const md5 = require('md5')

var app = express();

const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1:27017/Library'
mongoose.connect(mongoDB, {
  useMongoClient: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connect error.'))

// const str1 = 'meowu668329'
// const str2 = 'meowu668329'
// console.log(md5(str1));
// console.log(md5(str1) === md5(str2));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use(function(req, res, next) { 
//   res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//   res.header("Access-Control-Allow-Origin", "http://localhost");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(session({
  secret: 'meowu',
  resave: false,
  saveUninitialized: false
}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()) // express-validator依赖bodyParser，必须在它后面添加该中间件。
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
