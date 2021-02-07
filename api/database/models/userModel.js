const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true, select: false},
  following: {type: [String], required: false, select: false},
  followers: {type: [String], required: false, select: false}
}, {
  timestamps: true
});

module.exports = mongoose.model("user", UserSchema);