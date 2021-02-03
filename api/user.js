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
 * if it's a retweet, add to the data {retweet: {ownerId: the id of the user who tweeted, tweetId: the tweet id}}
 * return (200): succed, (404): user not founded, (400): bad request
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
    // check if the tweet format is valid
    tweet.validate()
      .then(() => {
        // update the correspondinf user to add the tweet
        userModel.updateOne({_id: req.token.id}, { $push: {tweets: tweet}})
          .then((update) => {
            // check if user has been modified
            if(update.nModified == 1) {
              res.status(200).send();
            } else {
              // no user founded
              res.status(404).send();
            }        
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send();
          });
      })
      .catch(e => {
        console.log(e);
        res.send(400).send();
      });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/**
 * get one user by id
 * need to pass the id in the url
 */
/*router.get('/findById/:userId', async (req, res) => {
  const userId = req.params.userId;
  // find the user
  const user = await userModel.findById(userId);
  // send the result
  res.status(200).send(user);
});*/


/**
 * find a user by its name
 */
/*router.get('/findByName/:name', async (req, res) => {
  const name = req.params.name;
  // find the user
  const user = await userModel.findOne({name});
  //send the result
  res.status(200).send(user);
});*/

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