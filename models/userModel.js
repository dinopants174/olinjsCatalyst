var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  fbId: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  proPic: {type: String, required: true},
  inspirations: [String],
  uploads: [String]
});

module.exports = mongoose.model('users', userSchema);