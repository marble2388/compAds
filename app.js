var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//passport dependencies
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;

var authAds = require('./routes/authAds');
var index = require('./routes/index');
var users = require('./routes/users');
//maybe an adscontroller maybe failure who knows at this point


var app = express();

//connect to mlabs with mongoose
var mongoose = require('mongoose');
var conn = mongoose.connection;
var mlabs = require('./config/globals');

conn.openUri(mlabs.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configure passport and sessions
app.use(session({
    secret: 'ohgodpleasework',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// link account model to passport
var Account = require('./models/account');
passport.use(Account.createStrategy());


// manage user login status through the db
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//routing
app.use('/', index);
app.use('/users', users);
//added app.use authads router
app.use('/ads', authAds);

//configure passport and sessions
app.use(session({
    secret: 'ohgodpleasework',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// link account model to passport
var Account = require('./models/account');
passport.use(Account.createStrategy());

//facebook login auth works i can log in with my account no issues.
var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
        clientID: '414665112291026',
        clientSecret: '224f9b9d870cca4045b408a0e5729ee9',
        callbackURL: 'http://localhost:3000/facebook/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        Account.findOne({ facebookId: profile.displayName }, function (err, user) {
           if(err){
               console.log(err);
           }
           else{
               if(user !==null){
                   cb(null,user);
               }else {
                   user = new Account({
                       FacebookId: profile.id,
                       username: profile.displayName
                   });
                   user.save(function(err){
                       if(err){
                           console.log(err);
                       }else{
                           cb(null,user);
                       }
                   });
               }
           }
        });
    }
));
//twitter login auth doesnt work button is pretty
var TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
        consumerKey: '8nT83eQxb5efkpxQ5mRQf5FJV ',
        consumerSecret: 'oayzMPaLwoM6serRDHcGQnAyZpOYUU5fY13ly9j9Fw0N95DZLh\n',
        callbackURL: "http://localhost:3000/twitter/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        Account.findOne({ twitterId: profile.displayName }, function (err, user) {
            if(err){
                console.log(err);
            }
            else{
                if(user !==null){
                    cb(null,user);
                }else {
                    user = new Account({
                        twitterId: profile.id,
                        username: profile.displayName
                    });
                    user.save(function(err){
                        if(err){
                            console.log(err);
                        }else{
                            cb(null,user);
                        }
                    });
                }
            }
        });
    }
));


// manage user login status through the db
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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
  res.render('error', {
    title: 'Comp2068 Ads Store'
  });
});

module.exports = app;
