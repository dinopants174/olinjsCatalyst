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

module.exports = router;