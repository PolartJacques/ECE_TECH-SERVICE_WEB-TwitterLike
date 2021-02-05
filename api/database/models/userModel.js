const mongoose = require('mongoose');
const tweetModel = require('./tweetModel');
const feedModel = require('./feedModel');

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true, select: false},
  following: {type: [String], required: false, select: false},
  followers: {type: [String], required: false, select: false},
  tweets: {type: [tweetModel.schema], required: false, select: false},
  feed: {type: [feedModel.schema], required: false, select: false}
}, {
  timestamps: true
});

module.exports = mongoose.model("user", UserSchema);