var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = mongoose.Schema({
  author: {type: Schema.ObjectId, ref: 'users', required: true},
  title: {type: String, required: true},
  dateCreated: {type: Date, required: true},
  pieces: [{type: Schema.ObjectId, ref: 'pieces'}]
});

module.exports = mongoose.model('boards', boardSchema);