var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var router = express.Router();

//href to /auth/facebook directs to Facebook's oAuth flow
router.get('/', passport.authenticate('facebook', {scope: 'public_profile'}));

//if you succed, our Facebook app takes you back to Catalyst, proceeds to home page if logged in, login page if not
router.get('/callback', 
	passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' })
);

//logs the user out of Catalyst and redirects to the login page
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;