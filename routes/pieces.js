var express = require('express');
var User = require('../models/userModel');
var Piece = require('../models/pieceModel');
var router = express.Router();

router.get('/feed', ensureAuthenticated, function(req, res){
	Piece.find({}, null, {sort: {date: -1}}).populate('author').exec(function (err, pieces){
		if (err){
			console.log("Error: ", err);
		} else {
			console.log("Here is your feed", pieces);
			res.json(pieces);
		}
	});
});

router.get('/getPiece', ensureAuthenticated, function(req, res){
	Piece.findById(req.body.srcId).populate('inspirations inspired').exec(function (err, piece)){
		if (err){
			console.log("Error: ", err);
		} else {
			res.json(piece);
		}
	}
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  } else {
  	res.redirect("/");
  }
}

module.exports = router;