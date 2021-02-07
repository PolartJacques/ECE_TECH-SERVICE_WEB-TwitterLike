const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require("./database/models/userModel");
const jwt = require('jsonwebtoken');
const tweetModel = require('./database/models/tweetModel');

/**
 * Register a new user
 * need data : {name: String, password: String}
 * return: (200){id, token} if succed, (409) if name already taken
 */
router.post("/register", (req, res) => {
  try {
    data = req.body;
    // hash the password
    bcrypt.hash(data.password, saltRounds, (err, hash) => {
      if(err) {
        console.log(err);
        res.status(500).send();
      } else {
        data.password = hash;
        // create the schema
        const newUser = new userModel(data);
        // try to save it in the database
        newUser.save()
          .then((user) => {
            const token = createToken(user._id);
            res.status(200).send({token, id: newUser._id});
          })
          .catch((e) => {
            // code 11000 mean duplicate key, so the username is already taken
            if(e.code == 11000) res.status(409).send();
            // other unhandled error
            else {
              console.log(e);
              res.status(500);
            }
          });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/**
 * log in an user
 * request data : {name: String, password: String}
 * return (200){token} if succed, (404) if no user founded, (401) if wrong password
 */
router.post("/login", (req, res) => {
  try {
    const data = req.body;
    // try to find the user
    userModel.findOne({name: data.name}).select('+password')
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
                const token = createToken(user._id);
                res.status(200).send({token, id: user._id});
              } else {
                // if password don't match send status unauthorized
                res.status(401).send();
              }
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
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/**
 * tweet something
 * request data {message: the message to tweet}
 * if it's a retweet, add to the data {retweet: the original tweet's id}
 */
router.post('/tweet', checkToken, (req, res) => {
  try {
    const data = req.body;
    let tweet;
    // check if it include a retweeted message to create the tweet
    if(data.retweet) {
      tweet = new tweetModel({ownerId: req.token.id, message: data.message, retweet: data.retweet});
    } else {
      tweet = new tweetModel({ownerId: req.token.id, message: data.message});
    }
    // save the tweet
    tweet.save()
      .then(() => {
        res.status(200).send();
      })
      .catch(e => {
        res.status(400).send();
      });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/**
 * follow someone
 * need data: {targetId: id of the user we want to follow}
 * return (200): succed, (400): bad request
 */
router.put('/follow', checkToken, (req, res) => {
  try {
    const data = req.body;
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
              .then(() => {
                res.status(200).send();      
              });
            });
        } else {
          res.status(400).send();
        }
      });
  } catch(e) {
    console.log('ERROR : /user/follow : ', e);
    res.status(500).send();
  }
});

/**
 * unfollow someone
 * need data: {targetId: id of the user we want to follow}
 * return (200): succed, (400): bad request
 */
router.put('/unfollow', checkToken, (req, res) => {
  try {
    const data = req.body;
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
              .then(() => {
                res.status(200).send();      
              });
            });
        } else {
          res.status(400).send();
        }
      });
  } catch(e) {
    console.log('ERROR : /user/follow : ', e);
    res.status(500).send();
  }
});

/**
 * return the feed of the current user, limited to 20 tweets
 * to load more of the feed, pass in the url the number of tweets already loaded
 */
router.get('/get/feed/:offset', checkToken, (req, res) => {
  try {
    // find the current user following
    userModel.findById(req.token.id)
    .select('following')
      .then(user => {
        // had itself to the following so we also see our tweets
        user.following.push(req.token.id);
        // find tweets of our following
        tweetModel.find({ownerId: {$in: user.following}})
          // sort them from more recent to oldest
          .sort({createdAt: -1})
          // limit the feed to 20 tweets
          .skip(parseInt(req.params.offset))
          .limit(20)
          .then(feed => {
            // send the feed
            res.status(200).send(feed);
          });
      });
  } catch(e) {
    console.log('ERROR : /user/get/feed : ', e);
    res.status(500).send();
  }
});

// METHODES

/**
 * create a json web token
 * @param id : user id
 * return a json web token
 */
function createToken(id) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = parseInt(process.env.TOKEN_EXPIRATION);
  return jwt.sign({id}, secret, {expiresIn});
}

/**
 * verify the token passed in the header
 * @param req : request
 * @param res : response
 * @param next
 */
function checkToken(req, res, next) {
  try {
    // get back the token
    const token = req.header('Authorization').split(' ')[1];
    // verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decrypted) => {
      if(err) {
        // token is not valid
        res.status(401).send();
      } else {
        req.token = decrypted;
        next();
      }
    });
  } catch(e) {
    console.log(e);
    res.status(500).send();
  }
}

// EXPORT
module.exports = router;