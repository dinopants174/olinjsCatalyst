var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  fbId: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  proPic: {type: String, required: true},
  inspirations: [{ type: Schema.ObjectId, ref: 'pieces' }],
  uploads: [{ type: Schema.ObjectId, ref: 'pieces' }]
});

module.exports = mongoose.model('users', userSchema);