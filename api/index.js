require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("./database/database");
const bodyParser = require('body-parser');

const user = require('./user');
const tweet = require('./tweet');
const auth = require('./auth');

app.use(cors());

app.use(bodyParser.json());
// add routes
app.use('/user', user);
app.use('/tweet', tweet);

app.get("/checkToken", auth.checkToken, (req, res) => {
  res.status(200).send();
});

app.listen(process.env.PORT, function() {
  console.log('Twitter like app listening on port 3000!');
});