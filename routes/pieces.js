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

router.get('/getPiece/:pieceId', ensureAuthenticated, function(req, res){
	console.log("Here is the id of the piece I want you to get: ", req.params.pieceId);
	Piece.findById(req.params.pieceId).populate({path: 'inspirations', populate: {path: 'inspirations', populate: {path: 'inspirations'}}}).exec(function (err, piece){
		if (err){
			console.log("Error: ", err);
		} else {
			Piece.populate(piece, {path: 'inspired', populate: {path: 'inspired', populate: {path: 'inspired'}}}, function(err, piece){
				console.log("Here is your fully populated piece for the tree: ", piece);
				res.json(piece);
			});
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