var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pieceSchema = mongoose.Schema({
  author: {type: Schema.ObjectId, ref: 'users', required: true},
  src: {type: String, required: true},
  date: {type: Date, required: true},
  title: {type: String, required: true}
});

module.exports = mongoose.model('pieces', pieceSchema);