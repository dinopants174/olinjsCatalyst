var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  fbId: String,
  inspirations: [String],
  uploads: [String]
});

module.exports = mongoose.model('users', userSchema);