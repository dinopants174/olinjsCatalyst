var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var index = require('./routes/index');
var login = require('./routes/auth');
var auth = require('./secrets');
var user = require('./routes/user');
var pieces = require('./routes/pieces');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || auth.facebook.clientID,
    clientSecret: process.env.FACEBOOK_SECRET || auth.facebook.clientSecret,
    callbackURL: process.env.FACEBOOK_CALLBACKURL || auth.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

// Connect to database
mongoose.connect('mongodb://olinjs:catalyst@ds025239.mlab.com:25239/catalyst');
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(){
  console.log('Mongodb Connection Successful');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 	//copied from olinjs example code using sessions
  secret: 'superS3CRE7',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());


// Routes for Our Backend Models
app.use('/', index);
app.use('/auth/facebook', login);
app.use('/api/user', user);
app.use('/api/pieces', pieces);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
