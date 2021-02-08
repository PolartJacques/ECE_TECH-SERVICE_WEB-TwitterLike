const express = require('express');
const router = express.Router();
const auth = require('./auth');
const tweetModel = require('./database/models/tweetModel');

/**
 * delete a tweet
 * need data: {tweetId: the id of the tweet to delete}
 */
router.post('/delete', auth.checkToken, (req, res) => {
  const data = req.body;
  // check data
  if(data.tweetId) {
    // find the tweet
    tweetModel.findById(data.tweetId)
    .then(tweet => {
      // check if tweet has been found
      if(tweet) {
        // check if the user attempting to delete the tweet own the tweet
        if(req.token.id == tweet.ownerId) {
          tweetModel.findByIdAndDelete(data.tweetId)
            .then(() => res.status(200).send())
            .catch(e => {
              console.log('ERROR : /tweet/delete : ', e);
              res.status(500).send();
            })
        } else res.status(401).send();
      } else res.status(404).send();
    })
    .catch(e => {
      console.log('ERROR : /twwet/delete : ', e);
      res.status(500).send();
    })
  } else res.status(400).send();
});



// EXPORT
module.exports = router;