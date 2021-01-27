const express = require('express');
const app = express();
const mongoose = require("./database/database");
const bodyParser = require('body-parser');

const user = require("./user");
const tweet = require("./tweet");

app.use(bodyParser.json());
// add routes
app.use("/user", user);
app.use("/tweet", tweet);

app.listen(3000, function() {
  console.log('Twitter like app listening on port 3000!');
});