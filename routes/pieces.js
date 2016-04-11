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

router.post('/getPiece', ensureAuthenticated, function(req, res){
	console.log("req.body contains: ", req.body);
	Piece.findById(req.body.srcId).populate({path: 'inspirations inspired', populate: {path: 'inspirations inspired', populate: {path: 'inspirations inspired'}}}).exec(function (err, piece){
		if (err){
			console.log("Error: ", err);
		} else {
			console.log("Here is your fully populated piece for the tree: ", piece);
			piece.inspirations.forEach(function(item, index){
				console.log("Index: ", index);
				console.log("Inspiration: ", item);
			});
			piece.inspired.forEach(function(item, index){
				console.log("Index: ", index);
				console.log("Inspired: ", item);
			});
			res.json(piece);
		}
	});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next(); 
  } else {
  	res.redirect("/");
  }
}

module.exports = router;