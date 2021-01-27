const express = require('express');
const router = express.Router();

const userModel = require("./database/models/userModel");
const tweetModel = require("./database/models/tweetModel");

// create A NEW USER
router.post("/create", async (req, res) => {
  data = req.body;
  // create the schema
  const newUser = new userModel(data);
  // try to save it in the database
  try {
    await newUser.save();
    res.status(200).send(newUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET ALL USER
router.get('/getall', async (req, res) => {
  // find all users
  const users = await userModel.find();
  // send the result
  res.status(200).send(users);
});

// GET ONE USER BY ID
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  // find the user
  const user = await userModel.findById(userId);
  // send the result
  res.status(200).send(user);
});

// GET TWEETS OF ONE USER
router.get('/gettweets/:userId', async (req, res) => {
  const userId = req.params.userId;
  //find the user
  const user = await userModel.findById(userId);
  // get his tweets
  const tweets = user.tweet;
  // send the result
  res.status(200).send(tweets);
});

// TWEET SOMETHING
router.post('/tweet/:userId', async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  // get the tweet
  tweet = new tweetModel(data);
  // get the user, add the tweet, save the user
  try {
    const user = await userModel.findById(userId);
    user.tweet.push(tweet);
    await user.save();
    res.status(200).send(tweet);
  } catch(err) {
    console.log(err);
    res.status(500).send('internal server error');
  }
}); 

// EXPORT
module.exports = router;