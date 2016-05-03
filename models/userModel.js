/* USER MODEL
We use the Facebook id as the unique identifier for each user and store data from Facebook oAuth that we might want to show the 
user later like their Facebook profile picture. The user has two fields created in Catalyst, myBoards and uploads. myBoards is an
array of boardModel documents and uploads is an array of pieceModel documents. Server side consistently returns the user object
with the user's uploads and myBoards populated for each route at our /api/user endpoint.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  fbId: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  proPic: {type: String, required: true},
  myBoards: [{type: Schema.ObjectId, ref: 'boards'}],
  uploads: [{ type: Schema.ObjectId, ref: 'pieces' }]
});

module.exports = mongoose.model('users', userSchema);