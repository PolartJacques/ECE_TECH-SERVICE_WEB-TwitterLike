const mongoose = require('mongoose');
const tweetModel = require('./tweetModel');

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  following: [{type: mongoose.Types.ObjectId, required: false}],
  followers: [{type: mongoose.Types.ObjectId, required: false}],
  tweet: [tweetModel.schema]
}, {
  timestamps: true
});

module.exports = mongoose.model("user", UserSchema);