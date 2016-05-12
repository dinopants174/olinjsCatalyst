var express = require('express');
var User = require('../models/userModel');
var Board = require('../models/boardModel');
var Piece = require('../models/pieceModel');
var router = express.Router();

//the /api/user endpoint uses the Facebook data serialized by passport in req.user to either find the existing user in our db
//or create a new user and send it to the client
//looks like this api would have benifited from using the async library or promises for dealing with the multiple async requests in some of the request handlers
router.get('/', ensureAuthenticated, function(req, res){
	console.log("PROFILE FROM SERVER", req.user);
    //this could probably use some refactoring
	if (req.user){ //if the user is not logged in, the request to /api/user will not return anything
		//uses the facebook id to find the user, populates each of the user's uploads, boards, and the pieces in those boards
		User.findOne({fbId: req.user.id}).populate({path: 'uploads myBoards', populate:{path: 'pieces'}}).exec(function (err, user){
			if (err){
				console.log("Error: ", err);
			} else {
				if (user){	//checks to see if we found the existing user, if a user is not found, we need to create a new one
					res.json(user);
				} else {
					var newUser = new User({fbId: req.user.id, name: req.user.displayName, proPic: req.user.photos[0].value});
					console.log("New User: ", newUser);
					newUser.save(function(err, user){
						if (err){
							console.log("Error: ", err);
						} else {
							//every new user by default gets a 'My Inspirations' board to add their inspirations to
							var newBoard = new Board({author: user.id, title: 'My Inspirations', dateCreated: new Date()});
							console.log("New Board: ", newBoard);
							newBoard.save(function(err, board){
								if (err){
									console.log("Error: ", err);
								} else {
									user.myBoards = [board.id]	//we now need to put this new board id in the user's myBoards array
									user.save(function(err, user){
										if (err){
											console.log("Error: ", err);
										} else {
											//the new user now has their 'My Inspirations' board in their myBoards array and an empty uploads array
											console.log("USER WITH NEW BOARD: ", user);
											res.json(user);
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

//the /api/user/postInspiraton endpoint takes an array of boards from the client and a piece id and adds that piece id to the pieces array for each of the boards.
//We then populate the user object again with their uploads and their updated boards which have pieces array populated with the pieces the boards contain,
//including the given piece
router.post('/postInspiration', ensureAuthenticated, function(req, res){
	var boardIds = req.body['boardIds[]'];	//we found that a post request with a single element in an array is received on server no longer as an array
	if (typeof(boardIds) === 'string'){
		var boardIdsArray = [boardIds];
	} else {
		var boardIdsArray = boardIds;
	}
	//boardIdsArray is an array if that is what was recieved from the post request and made into an array if a single element array is sent in the request
	boardIdsArray.forEach(function(id, index, boardIdsArray){	//for each of the boards, we push the piece id into the pieces array
		Board.findByIdAndUpdate(id, {$push: {pieces: req.body.srcId}}, function(err, board){
			if (err){
				console.log("Error: ", err);
			} else if (index === boardIdsArray.length - 1){	//having updated the last board, we can now send the updated user object to the client
				//we find the user using their facebook id, we populate their uploads, their boards, and the pieces those boards contain
				User.findOne({fbId: req.user.id}).populate({path: 'uploads myBoards', populate: {path: 'pieces'}}).exec(function (err, user){
					if (err){
						console.log("Error: ", err);
					} else {
						console.log("USER WITH UPDATED BOARD(s): ", user);
						res.json(user);
					}
				});
			}
		});
	});
});

//the /api/user/deleteInspiration endpoint takes an array of boards from the client and a piece id and removes that piece id from the pieces array for each of the
//boards. We then populate the user object again with their uploads and their updated boards which have pieces array populated with the pieces the boards contain,
//which no longer include the given piece
router.post('/deleteInspiration', ensureAuthenticated, function(req, res){
	//this route is basically the same as /postInspiration except we pull from the pieces array of the boards instead of push when we updated them
	var boardIds = req.body['boardIds[]'];
	if (typeof(boardIds) === 'string'){
		var boardIdsArray = [boardIds];
	} else {
		var boardIdsArray = boardIds;
	}
	boardIdsArray.forEach(function(id, index, boardIdsArray){
		Board.findByIdAndUpdate(id, {$pull: {pieces: req.body.srcId}}, function(err, board){
			if (err){
				console.log("Error: ", err);
			} else if (index === boardIdsArray.length - 1){
				User.findOne({fbId: req.user.id}).populate({path: 'uploads myBoards', populate: {path: 'pieces'}}).exec(function (err, user){
					if (err){
						console.log("Error: ", err);
					} else {
						console.log("USER WITH UPDATED BOARD(s): ", user);
						res.json(user);
					}
				});
			}
		});
	});
});

//the /api/user/postUpload endpoint takes the iframe code, the title, and the inspirations that led to the creation of this piece from the client
//and returns the updated user object with the uploaded piece now in the user's uploads array. We create the new piece and we update the inspired array
//for each of the piece's immediate parents so that the parents know of their child. We then push the new piece into the user's uploads array, save the
//user document, populate it, and then return it to the client
router.post('/postUpload', ensureAuthenticated, function(req, res){
	console.log("req.body stuff", req.body);
	User.findOne({fbId: req.user.id}, function(err, user){	//find the user in order to know the id for the author of the piece we are about to create
		console.log("Here is your current user: ", user);
		var newPiece = new Piece({author: user.id, src: req.body.src, date: new Date(), title: req.body.title, inspirations: req.body['inspirations[]']});
		newPiece.save(function(err, piece){	//new piece has been created and it knows its parents but its parents don't know it exists yet
			if (err){
				console.log("Error: ", err);
			} else {
				console.log("A piece was created, here it is: ", piece);
				//loop through each of the piece's inspirations and update the inspired array of each immediate parent for this new piece so that they
				//are aware of their child
				piece.inspirations.forEach(function(item, index){
					console.log("Here is the id of the parent: ", item);
					Piece.findByIdAndUpdate(item, {$push: {inspired: piece.id}}, {new: true}, function(err, piece){
						if (err){
							console.log("Error: ", err);
						}
					});
				});
				user.uploads.push(piece.id);	//we push the piece id into the user's uploads array
				console.log("Here is your updated user: ", user);
				user.save(function(err, user){
					if (err){
						console.log("Error: ", err);
					} else {
						//populate the user's uploads array, which includes the new piece, and all of the user's boards and the pieces they contain
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

//the /api/user/deleteUpload endpoint takes the id of the piece that needs to be deleted and returns to the client the updated user object, with that
//piece removed from the user object's uploads array. We start by finding all the boards with that piece in them and remove that piece from the board's
//pieces array. We then find the piece and go through each of its immediate parents and children and remove the piece from the inspired and inspirations
//arrays respectively. Finally, we delete the piece, pull it from the user's uploads array, and populate the new user object before sending it to client
router.post('/deleteUpload', ensureAuthenticated, function(req, res){
	Board.find({pieces: req.body.srcId}, function(err, boards){	//find all boards with piece in its pieces array
		if (err){
			console.log("Error: ", err);
		} else {
			boards.forEach(function(board, index){
				board.pieces = board.pieces.filter(function (id){
					return id != req.body.srcId;	//board.pieces now do not contain the soon to be deleted piece id
				});
				board.save(function(err){
					if (err){
						console.log("Error: ", err);
					}
				});
			});
			Piece.findById(req.body.srcId, function(err, piece){	//find the piece to be deleted
				//go through each of the piece's parents and remove it from their inspired array, deleting their relationship to their soon to be deleted child
				piece.inspirations.forEach(function(item, index){
					Piece.findByIdAndUpdate(item, {$pull: {inspired: piece.id}}, {new: true}, function(err, inspiration){
						if (err){
							console.log("Error: ", err);
						}
					});
				});
				//go through each of the piece's children and remove it from their inspirations array, deleting their relationship to their soon to be deleted parent
				piece.inspired.forEach(function(item, index){
					Piece.findByIdAndUpdate(item, {$pull: {inspirations: piece.id}}, {new: true}, function(err, inspired){
						if (err){
							console.log("Error: ", err);
						}
					});
				});
				piece.remove(function(err, piece){	//finally delete the piece
					if (err){
						console.log("Error: ", err);
					} else {
						//update the user object by pulling the piece id from their uploads, populate the updated user's uploads, myBoards, and the pieces in those boards
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

//the /api/user/postBoard endpoint takes the title of the board from client and returns to the client the user object with uploads, myBoards, and the pieces
//in those boards populated, with an empty new board added to the user's myBoards array. We find the user in order to know the board's author, create and save
//the new board, push the new board's id into the user's myBoards array, and then populate the updated user's uploads, myBoards, and the pieces in those boards
router.post('/postBoard', ensureAuthenticated, function(req, res){
	User.findOne({fbId: req.user.id}, function(err, user){	//find the user so we know the author of the soon to be created board
		if (err){
			console.log("Error: ", err);
		} else {
			var newBoard = new Board({author: user.id, title: req.body.boardTitle, dateCreated: new Date()});
			newBoard.save(function(err, board){	//new board is created
				if (err){
					console.log("Error: ", err);
				} else {
					console.log("Here is your new board: ", board);
					user.myBoards.push(board.id);	//user's myBoards array now contains the newly created board
					user.save(function(err, user){
						if (err){
							console.log("Error: ", err);
						} else {
							//populate the user's uploads and myBoards which contains the new board and the pieces in those boards, new board is empty
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

//the /api/user/deleteBoard endpoint takes the boardId that needs to be deleted from the client and returns the updated user object with all of the uploads, boards,
//and pieces in those boards populated, with the myBoards array no longer containing the deleted board. We first remove the board and then update the user
//object by pulling the deleted board id from the myBoards array. We then populate the updated user object and send it to the client.
router.post('/deleteBoard', ensureAuthenticated, function(req, res){
	Board.findByIdAndRemove(req.body.boardId, function(err, board){	//finds and deletes the board specified by client
		if (err){
			console.log("Error: ", err);
		} else {
			//updates the user's myBoards array by pulling the deleted board id from myBoards array, populates the uploads and boards of the updated user and the pieces in those boards
			User.findOneAndUpdate({fbId: req.user.id}, {$pull: {myBoards: req.body.boardId}}, {new: true}).populate({path: 'uploads myBoards', populate: {path: 'pieces'}}).exec(function (err, user){
				if (err){
					console.log("Error: ", err);
				} else {
					console.log("Here is your new user: ", user);
					res.json(user);
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
