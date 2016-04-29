var express = require('express');
var User = require('../models/userModel');
var Board = require('../models/boardModel');
var Piece = require('../models/pieceModel');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res){
	console.log("PROFILE FROM SERVER", req.user);
	if (req.user){
		User.findOne({fbId: req.user.id}).populate({path: 'uploads myBoards', populate:{path: 'pieces'}}).exec(function (err, user){
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
							var newBoard = new Board({author: user.id, title: 'My Inspirations', dateCreated: new Date()});
							console.log("New Board: ", newBoard);
							newBoard.save(function(err, board){
								if (err){
									console.log("Error: ", err);
								} else {
									user.myBoards = [board.id]
									user.save(function(err, user){
										if (err){
											console.log("Error: ", err);
										} else {
											console.log("USER WITH NEW BOARD: ", user);
											res.json(user);	//you have a new board and its empty and so is uploads
										}
									})
								}
							});
						}
					});
				}
			}
		});
	}
});

router.post('/postInspiration', ensureAuthenticated, function(req, res){
	Board.findByIdAndUpdate(req.body.boardId, {$push: {pieces: req.body.srcId}}, function(err, board){
		if (err){
			console.log("Error: ", err);
		} else {
			User.findOneAndUpdate({fbId: req.user.id}).populate({path: 'uploads myBoards', populate: {path: 'pieces'}}).exec(function (err, user){
				if (err){
					console.log("Error: ", err);
				} else {
					console.log("USER WITH UPDATED BOARD: ", user);
					res.json(user);
				}
			});
		}
	});
});

router.post('/deleteInspiration', ensureAuthenticated, function(req, res){
	Board.findByIdAndUpdate(req.body.boardId, {$pull: {pieces: req.body.srcId}}, function(err, board){
		if (err){
			console.log("Error: ", err);
		} else {
			User.findOneAndUpdate({fbId: req.user.id}).populate({path: 'uploads myBoards', populate: {path: 'pieces'}}).exec(function (err, user){
				if (err){
					console.log("Error: ", err);
				} else {
					console.log("USER WITH UPDATED BOARD: ", user);
					res.json(user);
				}
			});
		}
	});
});

router.post('/postUpload', ensureAuthenticated, function(req, res){
	console.log("req.body stuff", req.body);
	User.findOne({fbId: req.user.id}, function(err, user){
		console.log("Here is your current user: ", user);
		var newPiece = new Piece({author: user.id, src: req.body.src, date: new Date(), title: req.body.title, inspirations: req.body['inspirations[]']});
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
						User.populate(user, {path: 'uploads myBoards', populate: {path: 'pieces'}}, function(err, user){
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

router.post('/deleteUpload', ensureAuthenticated, function(req, res){
	Board.find({pieces: req.body.srcId}, function(err, boards){
		if (err){
			console.log("Error: ", err);
		} else {
			boards.forEach(function(board, index){
				board.pieces = board.pieces.filter(function (id){
					return id != req.body.srcId;
				});
				board.save(function(err){
					if (err){
						console.log("Error: ", err);
					}
				});
			});
			Piece.findById(req.body.srcId, function(err, piece){
				piece.inspirations.forEach(function(item, index){
					Piece.findByIdAndUpdate(item, {$pull: {inspired: piece.id}}, {new: true}, function(err, inspiration){
						if (err){
							console.log("Error: ", err);
						} else {
							console.log("Here is the updated parent: ", inspiration);
						}
					});
				});
				piece.inspired.forEach(function(item, index){
					Piece.findByIdAndUpdate(item, {$pull: {inspirations: piece.id}}, {new: true}, function(err, inspired){
						if (err){
							console.log("Error: ", err);
						} else {
							console.log("Here is the updated child: ", inspired);
						}
					});
				});
				piece.remove(function(err, piece){
					if (err){
						console.log("Error: ", err);
					} else {
						User.findOneAndUpdate({fbId: req.user.id}, {$pull: {uploads: req.body.srcId}}, {new: true}).populate({path: 'uploads myBoards', populate: {path: 'pieces'}}).exec(function (err, user){
							if (err){
								console.log("Error: ", err);
							} else {
								console.log("HERE IS THE FINAL USER: ", user);
								res.json(user);
							}
						});
					}
				});
			});
		}
	});
});

router.post('/postBoard', ensureAuthenticated, function(req, res){
	User.findOne({fbId: req.user.id}, function(err, user){
		if (err){
			console.log("Error: ", err);
		} else {
			var newBoard = new Board({author: user.id, title: req.body.boardTitle, dateCreated: new Date()});
			newBoard.save(function(err, board){
				if (err){
					console.log("Error: ", err);
				} else {
					console.log("Here is your new board: ", board);
					user.myBoards.push(board.id);
					user.save(function(err, user){
						if (err){
							console.log("Error: ", err);
						} else {
							User.populate(user, {path: 'uploads myBoards', populate: {path: 'pieces'}}, function(err, user){
								if (err){
									console.log("Error: ", err);
								} else {
									console.log("Here is your new user: ", user);
									res.json(user);
								}
							});
						}
					});
				}
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