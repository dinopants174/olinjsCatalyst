var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var router = express.Router();

router.get('/', passport.authenticate('facebook', {scope: 'public_profile'}));
router.get('/callback', 
	passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' })
);
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/");
});

router.get('/currentUser', ensureAuthenticated, function(req, res) {
	console.log("PROFILE FROM SERVER", req.user);
	//req.body will contain the id for the user, find them in the server and send it to client side
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  } else {
  	res.redirect("/");
  }
}


module.exports = router;