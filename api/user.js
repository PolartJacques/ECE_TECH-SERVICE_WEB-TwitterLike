const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require("./database/models/userModel");
const tweetModel = require('./database/models/tweetModel');
const auth = require('./auth');

/**
 * find an user by it's id
 */
router.get("/findBy/id/:id", auth.checkToken, (req, res) => {
  const id = req.params.id;
  userModel.findById(id)
    .select('name followers following')
    .lean()
    .then(user => {
      if(user) {
        // make user match client's user interface
        user.isFollowed = user.followers.includes(req.token.id);
        user.followers = user.followers.length;
        user.following = user.following.length;
        res.status(200).send(user);
      } else res.status(404).send();
    })
    .catch(err => {
      console.log("ERROR : /user/findBy/id : ", err);
      res.status(500).send();
    });
});

/**
 * find a list of user whith a similar name
 */
router.get("/findBy/nameLike/:name", auth.checkToken, (req, res) => {
  const name = req.params.name;
  userModel.find({name: new RegExp(name, 'i')})
    .select('-createdAt -updatedAt -__v +followers +following')
    .lean()
    .then(users => {
      if(users) {
        // adpat user to client user interface
        users.map(user => {
          user.isFollowed = user.followers.includes(req.token.id);
          user.followers = user.followers.length;
          user.following = user.following.length;
        });
        res.status(200).send(users);
      }
      else res.status(404).send();
    })
    .catch(e => {
      console.log('ERROR : /user/findBy/name : ', e);
      res.status(500).send();
    })
})

/**
 * Register a new user
 * need data : {name: String, password: String}
 * return: (200){id, token} if succed, (409) if name already taken
 */
router.post("/register", (req, res) => {
  data = req.body;
  // check the data
  if(data.name && data.password) {
    // hash the password
    bcrypt.hash(data.password, saltRounds, (err, hash) => {
      if(err) {
        console.log('ERROR : /user/register : ', err);
        res.status(500).send();
      } else {
        data.password = hash;
        // create the schema
        const newUser = new userModel(data);
        // try to save it in the database
        newUser.save()
          .then((user) => {
            const token = auth.createToken(user._id);
            user.password = undefined;
            res.status(200).send({token});
          })
          .catch((e) => {
            // code 11000 mean duplicate key, so the username is already taken
            if(e.code == 11000) res.status(409).send();
            else {
              console.log(e);
              res.status(500);
            }
          });
      }
    });
  } else res.status(400).send();
});

/**
 * log in an user
 * request data : {name: String, password: String}
 * return (200){token} if succed, (404) if no user founded, (401) if wrong password
 */
router.post("/login", (req, res) => {
  const data = req.body;
  // check the data
  if(data.name && data.password) {
    // try to find the user
    userModel.findOne({name: data.name}).select('name password followers following')
    .then(user => {
      // check if we found the user
      if(user) {
        // compare password to hash in database
        bcrypt.compare(data.password, user.password, (err, same) => {
          if(err) {
            console.log(err);
            res.status(500).send();
          } else {
            // check if the password match
            if(same) {
              const token = auth.createToken(user._id);
              user.password = undefined;
              res.status(200).send({token});
            } else res.status(401).send();
          }
        });
      } else {
        // if user not found send status not found
        res.status(404).send();
      }
    })
    .catch(e => {
      console.log(e);
      res.status(500).send();
    });
  } else res.status(400).send();
});

/**
 * tweet something
 * request data {message: the message to tweet}
 * if it's a retweet, add to the data {retweet: the original tweet's id}
 */
router.post('/tweet', auth.checkToken, (req, res) => {
  const data = req.body;
  // check data
  if(data.message) {
    let tweet;
    // check if it include a retweeted message to create the tweet
    if(data.retweet) tweet = new tweetModel({ownerId: req.token.id, message: data.message, retweet: data.retweet});
    else tweet = new tweetModel({ownerId: req.token.id, message: data.message});
    // save the tweet
    tweet.save()
      .then(() => {
        res.status(200).send(tweet);
      })
      .catch(e => {
        console.log('ERROR : /user/tweet : ', e);
        res.status(500).send();
      });
  } else res.status(400).send();
});

/**
 * follow someone
 * need data: {targetId: id of the user we want to follow}
 */
router.put('/follow', auth.checkToken, (req, res) => {
  const data = req.body;
  // check data
  if(data.targetId) {
    // find the user to follow
    userModel.findById(data.targetId)
      .then(targetUser => {
        // check if target user exist
        if(targetUser) {
          // add the target user's id to the user's following array
          userModel.updateOne({_id: req.token.id}, { $addToSet: {following: targetUser._id}})
            .then(() => {
              // add user id to the target user's followers array
              userModel.updateOne({_id: data.targetId}, { $addToSet: {followers: req.token.id}})
                .then(() => res.status(200).send());
            });
        } else res.status(400).send();
      });
  } else res.status(400).send();
});

/**
 * unfollow someone
 * need data: {targetId: id of the user we want to follow}
 */
router.put('/unfollow', auth.checkToken, (req, res) => {
  const data = req.body;
  // check data format
  if(data.targetId) {
    // find the user to follow
    userModel.findById(data.targetId)
      .then(targetUser => {
        // check if target user exist
        if(targetUser) {
          // remove the target user's id to the user's following array
          userModel.updateOne({_id: req.token.id}, { $pull: {following: targetUser._id}})
            .then(() => {
              // add user id to the target user's followers array
              userModel.updateOne({_id: data.targetId}, { $pull: {followers: req.token.id}})
              .then(() => res.status(200).send());
            });
        } else {
          res.status(400).send();
        }
      })
      .catch(e => {
        console.log('ERROR : /user/unfollow : ', e);
        res.status(500).send();
      });
  } else res.status(400).send();
});

/**
 * return the feed of the current user, limited to 20 tweets
 * to load more of the feed, pass in the url the number of tweets already loaded
 */
router.get('/get/feed/:offset', auth.checkToken, (req, res) => {
  // find the current user following
  userModel.findById(req.token.id)
    .select('following')
    .then(user => {
      // had itself to the following so we also see our tweets
      user.following.push(req.token.id);
      // find tweets of our following
      tweetModel.find({ownerId: {$in: user.following}}).select('-updatedAt -__v')
        // sort them from more recent to oldest
        .sort({createdAt: -1})
        // limit the feed to 20 tweets
        .skip(parseInt(req.params.offset))
        .limit(20)
        .lean()
        .then(feed => {
          // transform tweets to match client tweet interface
          feed.map(tweet => {
            tweet.isLiked = tweet.like.includes(req.token.id);
            tweet.like = tweet.like.length;
          });
          // send the feed
          res.status(200).send(feed);
        });
    })
    .catch(e => {
      console.log('ERROR : /user/get/feed : ', e);
      res.status(500).send();
    });
});

/**
 * get the data of the current user
 */
router.get('/get/data', auth.checkToken, (req, res) => {
  userModel.findById(req.token.id)
    .select('name followers following')
    .lean()
    .then(user => {
      // make user match client user interface
      user.isFollowed = user.followers.includes(req.token.id);
      user.followers = user.followers.length;
      user.following = user.following.length;
      res.status(200).send(user)
    })
    .catch(e => {
      console.log('ERROR : /user/get/data : ', e);
      res.status(500).send();
    });
});

/**
 * get tweets of an user
 */
router.get('/get/tweets/of/:targetId/:offset', auth.checkToken, (req, res) => {
  const targetId = req.params.targetId;
  tweetModel.find({ownerId: targetId})
    .select('-updatedAt -__v')
    // sort them from more recent to oldest
    .sort({createdAt: -1})
    // limit to 20 tweets
    .skip(parseInt(req.params.offset))
    .limit(20)
    .lean()
    .then(tweets => {
      // transform tweets to match client tweet interface
      tweets.map(tweet => {
        tweet.isLiked = tweet.like.includes(req.token.id);
        tweet.like = tweet.like.length;
      });
      // send the feed
      res.status(200).send(tweets);
    });
});



// EXPORT
module.exports = router;