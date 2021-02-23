const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  ownerId: {type: String, required: true},
  message: {type: String, required: false, default: null},  // the tweet
  like: {type: [String], required: false, default: []}  // array of user id
}, {
  timestamps: true
});

module.exports = mongoose.model("tweet", TweetSchema);