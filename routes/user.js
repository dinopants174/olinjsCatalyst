var express = require('express');
var User = require('../models/userModel');
var Piece = require('../models/pieceModel');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res){
	console.log("PROFILE FROM SERVER", req.user);
	if (req.user){
		User.findOne({fbId: req.user.id}).populate('inspirations uploads').exec(function (err, user){
			if (err){
				console.log("Error: ", err);
			} else {
				if (user){
					res.json(user);
				} else {
					var newUser = new User({fbId: req.user.id, name: req.user.displayName, proPic: req.user.photos[0].value});
					console.log("New User: ", newUser);
					newUser.save(function(err, user){
						if (err){
							console.log("Error: ", err);
						} else {
							res.json(user);	//user will have an empty inspirations and uploads array
						}
					});
				}
			}
		});
	}
});

router.post('/postInspiration', ensureAuthenticated, function(req, res){
	User.findOneAndUpdate({fbId: req.user.id}, {$push: {inspirations: req.body.srcId}}, {new: true}).populate('inspirations uploads').exec(function (err, user){
		if (err){
			console.log("Error: ", err);
		} else {
			res.json(user);
		}
	});
});

router.post('/deleteInspiration', ensureAuthenticated, function(req, res){
	User.findOneAndUpdate({fbId: req.user.id}, {$pull: {inspirations: req.body.srcId}}, {new: true}).populate('inspirations uploads').exec(function (err, user){
		if (err){
			console.log("Error: ", err);
		} else {
			res.json(user);
		}
	});
});

router.post('/postUpload', ensureAuthenticated, function(req, res){
	User.findOne({fbId: req.user.id}, function(err, user){
		console.log("Here is your current user: ", user);
		var newPiece = new Piece({author: user.id, src: req.body.src, date: new Date(), title: req.body.title, inspirations: req.body.inspirations});
		newPiece.save(function(err, piece){
			if (err){
				console.log("Error: ", err);
			} else {
				console.log("A piece was created, here it is: ", piece);
				piece.inspirations.forEach(function(item, index){
					console.log("Here is the id of the parent: ", item);
					Piece.findByIdAndUpdate(item, {$push: {inspired: piece.id}}, {new: true}, function(err, piece){
						if (err){
							console.log("Error: ", err);
						} else {
							console.log("Here is the updated parent: ", piece);
						}
					});
				});
				user.uploads.push(piece.id);
				console.log("Here is your updated user: ", user);
				user.save(function(err, user){
					if (err){
						console.log("Error: ", err);
					} else {
						User.populate(user, 'inspirations uploads', function(err, user){
							if (err){
								console.log("Error: ", err);
							} else {
								console.log("And here should be your final updated user", user);
								res.json(user);
							}
						});			
					}
				});
			}
		});
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