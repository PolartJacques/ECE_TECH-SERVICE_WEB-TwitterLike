const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require("./database/models/userModel");
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * need data : {name: String, password: String}
 */
router.post("/register", async (req, res) => {
  data = req.body;
  // hash the password
  bcrypt.hash(data.password, saltRounds, async (err, hash) => {
    data.password = hash;
    // create the schema
    const newUser = new userModel(data);
    // try to save it in the database
    try {
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).send({token, id: newUser._id});
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

/**
 * log in an user
 * request data : {name: String, password: String}
 */
router.post("/login", async (req, res) => {
  const data = req.body;
  // try to find the user
  const user = await userModel.findOne({name: data.name}).select('+password');
  // check if an user haas been founded
  if(user) {
    // check if password match
    bcrypt.compare(data.password, user.password, (err, same) => {
      if(same) {
        // return a json
        const token = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).send({token, id: user._id});
      } else {
        res.status(401).send();
      }
    });
  } else {
    res.status(404).send();
  }
});

/**
 * get one user by id
 * need to pass the id in the url
 */
router.get('/findById/:userId', async (req, res) => {
  const userId = req.params.userId;
  // find the user
  const user = await userModel.findById(userId);
  // send the result
  res.status(200).send(user);
});


/**
 * find a user by its name
 */
router.get('/findByName/:name', async (req, res) => {
  const name = req.params.name;
  // find the user
  const user = await userModel.findOne({name});
  //send the result
  res.status(200).send(user);
});

// EXPORT
module.exports = router;