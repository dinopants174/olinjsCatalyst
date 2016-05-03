/* BOARD MODEL
The board model is the intermediate layer between the user model and the piece model. A user creates a board that goes into their
myBoards array and each board has an array of ids to the pieces that are on that board. The board has the user id for its author, a
title which is provided by the user when they create the board, and the dateCreated which is automatically populated when the server
receives the request to create a new board.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = mongoose.Schema({
  author: {type: Schema.ObjectId, ref: 'users', required: true},
  title: {type: String, required: true},
  dateCreated: {type: Date, required: true},
  pieces: [{type: Schema.ObjectId, ref: 'pieces'}]
});

module.exports = mongoose.model('boards', boardSchema);