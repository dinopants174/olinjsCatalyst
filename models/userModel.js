var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  fbId: String
});

module.exports = mongoose.model('users', userSchema);