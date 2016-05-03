/* PIECE MODEL
Each piece has an author which is stored as the user document's id if we wanted to populate the author. The src and title are
provided by the user uploading the piece and the date is automatically assigned when the user uploads the piece. Now in order to
create the tree of pieces that inspired this upload and the tree of pieces that this upload inspired, we have an inspirations array
that holds the ids of the immediate parents of this piece. We have an inspired array that holds the ids of the immediate children
of this piece. When a piece is first uploaded, the inspirations array is the only array of the two that contains references to other
pieces.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pieceSchema = mongoose.Schema({
  author: {type: Schema.ObjectId, ref: 'users', required: true},
  src: {type: String, required: true},
  date: {type: Date, required: true},
  title: {type: String, required: true},
  inspirations: [{type: Schema.ObjectId, ref: 'pieces', required: true}],
  inspired: [{type: Schema.ObjectId, ref: 'pieces'}]
});

module.exports = mongoose.model('pieces', pieceSchema);