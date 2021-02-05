const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
  ownerId: {type: String, request: true},
  tweetId: {type: String, requested: true},
  date: {type: Date, requested: true}
},{ 
  _id : false
});

module.exports = mongoose.model("feed", FeedSchema);