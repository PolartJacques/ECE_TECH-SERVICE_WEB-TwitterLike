const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  message: {type: String, required: true},
  like: {type: Number, required: false, default: 0},
  retweet: {type: Number, required: false, default: 0}
}, {
  timestamps: true
});

module.exports = mongoose.model("tweet", TweetSchema);