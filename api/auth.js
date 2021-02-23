const jwt = require('jsonwebtoken');

class Auth {
  /**
   * create a json web token
   * @param id : user id
   * return a json web token
   */
  createToken(id) {
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
  checkToken(req, res, next) {
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

  
}

module.exports = new Auth();