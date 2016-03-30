var express = require('express');
var User = require('../models/userModel');
var Piece = require('../models/pieceModel');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res) {
	console.log("PROFILE FROM SERVER", req.user);
	if (req.user){
		User.findOne({fbId: req.user.id}, function(err, user){
			if (err){
				console.log("Error: ", err);
			} else {
				console.log("User: ", user);
				if (user){
					res.json(user);
				} else {
					var newUser = new User({fbId: req.user.id, name: req.user.displayName, proPic: req.user.photos[0].value});
					console.log("New User: ", newUser);
					newUser.save(function(err, user){
						if (err){
							console.log("Error: ", err);
						} else {
							res.json(user);
						}
					});
				}
			}
		});
	}
});

//yo for these next two routes, you need to replace $push 
router.post('/postInspiration', ensureAuthenticated, function(req, res){
	User.findOneAndUpdate({fbId: req.user.id}, {$push: {inspirations: req.body.src}}, {new: true}, function(err, user){
		if (err){
			console.log("Error: ", err);
		} else {
			res.json(user);
		}
	});

});

router.post('/postUpload', ensureAuthenticated, function(req, res){
	User.findOneAndUpdate({fbId: req.user.id}, {$push: {uploads: req.body.src}}, {new: true}, function(err, user){
		if (err){
			console.log("Error: ", err);
		} else {
			// res.json(user);
			var newPiece = new Piece({author: req.user.id, src: req.body.src, date: new Date(), title: req.body.title});
			newPiece.save(function(err, piece){
				if (err){
					console.log("Error: ", err);
				} else {
					console.log("A piece was created, here it is: ", piece);
					res.json(user);
				}
			});
		}
	});
});

router.get('/feed', ensureAuthenticated, function(req, res){
	Piece.find({}, null, {sort: {date: -1}}, function(err, pieces){
		if (err){
			console.log("Error: ", err);
		} else {
			console.log("Here is your feed: ", pieces);
			res.json(pieces);
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