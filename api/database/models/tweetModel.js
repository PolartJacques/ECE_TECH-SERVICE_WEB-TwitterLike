const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  ownerId: {type: String, required: true},
  message: {type: String, required: true},  // the tweet
  theRetweet: {type: {userId: String, tweetId: String}, required: false, default: null},  // a retweet (optional)
  like: {type: Number, required: false, default: 0},  // number of like
  retweet: {type: Number, required: false, default: 0}  // number of retweet
}, {
  timestamps: true
});

module.exports = mongoose.model("tweet", TweetSchema);