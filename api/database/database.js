// documentation mongodb : 
// https://www.digitalocean.com/community/tutorials/nodejs-crud-operations-mongoose-mongodb-atlas

const mongoose = require('mongoose');

// CONNECT TO DATABASE
try {
  mongoose.connect('mongodb+srv://admin:admin@cluster0.qk7p2.mongodb.net/TwitterLike?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
      console.log("Connected to the data base !")
  });
} catch (error) {
    console.log(error)
    process.exit(1)
}

module.exports = mongoose;