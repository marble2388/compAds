var express = require('express');
var router = express.Router();

// add passport for registration and login
var passport = require('passport');
var Account = require('../models/account');


// get home page.
router.get('/', function(req, res, next) {
  res.render('index', {
      title: 'The Ad Store'
  });
});

// get register page.
router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'Register'
    });
});
//post user registered
router.post('/register', function(req, res, next) {
    //use Account model
    Account.register(new Account({ username: req.body.username }),
    req.body.password, function(err, account){
        if(err) {
            console.log(err);
            res.render('error', { title: 'Create Account Error'})
        }
            res.redirect('/login');
        });

});



// get login page.
router.get('/login', function(req, res, next) {
    //set,clear session message and login render
    var messages = req.session.messages || [];
    req.session.messages = [];
    res.render('login',
        { title: 'Login',
        messages: messages
        });
});
//post user login
router.post('/login', passport.authenticate('local', {
//redirects on success or failure
    successRedirect: '/ads',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

//logout get
router.get('/logout', function(req,res,next) {
   req.logout();
    res.redirect('/');
});



module.exports = router;
