var express = require('express');
var User = require('../models/userModel');
var Piece = require('../models/pieceModel');
var router = express.Router();

//the /api/pieces endpoint gets all of the pieces in our pieces collection in our database, sorts them in descending order by date so the 
//newest pieces are on the top, populates the author for each piece, and sends the pieces to client
router.get('/feed', ensureAuthenticated, function(req, res){
	Piece.find({}, null, {sort: {date: -1}}).populate('author').exec(function (err, pieces){
		if (err){
			console.log("Error: ", err);
		} else {
			res.json(pieces);
		}
	});
});

//the /api/pieces/getPiece/:pieceId endpoint takes a given piece id as a parameter, finds it, and then populates it's immediate parents and
//children, and then the immediate parent's parents and the immediate children's children, and so on one more time. We use this endpoint to
//get all of the data we need to create the tree that shows the parents of each piece and the children of each piece
router.get('/getPiece/:pieceId', ensureAuthenticated, function(req, res){
	//we start by populating the piece's parents, the piece's parents' parents, and the piece's parents' parents' parents
	Piece.findById(req.params.pieceId).populate({path: 'inspirations', populate: {path: 'inspirations', populate: {path: 'inspirations'}}}).exec(function (err, piece){
		if (err){
			console.log("Error: ", err);
		} else {
			//we then populate the piece's children, the piece's children's children, and the piece's childrens' childrens' children
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