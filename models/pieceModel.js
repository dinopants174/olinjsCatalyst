var mongoose = require('mongoose');

var pieceSchema = mongoose.Schema({
  author: {type: String, required: true},
  src: {type: String, required: true},
  date: {type: Date, required: true},
  title: {type: String, required: true}
});

module.exports = mongoose.model('pieces', pieceSchema);