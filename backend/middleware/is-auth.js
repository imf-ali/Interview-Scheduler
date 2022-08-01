const jwt = require('jsonwebtoken');
const Jwttoken = require('../models/jwttoken');
const constants = require('../constants');
const fs = require('fs');

const loadToken = () => {
  const dataBuffer=fs.readFileSync('token.json')
  const dataJSON=dataBuffer.toString()
  const data=JSON.parse(dataJSON);
  return data.token;
}

module.exports = (req, res, next) => {
  // console.log('checking....')
  // console.log(userController.TOKEN);
  const myToken = loadToken();
  // console.log(myToken);
  // req.header['Authorization'] = myToken;
  const authHeader = myToken;
  // console.log(authHeader);
  if (!authHeader) {
    const error = new Error(constants.notAuthenticated);
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, constants.SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  // console.log(decodedToken)
  if (!decodedToken) {
    const error = new Error(constants.notAuthenticated);
    error.statusCode = 401;
    throw error;
  }
  Jwttoken.findOne({token: token})
  .then(result => {
    if(result){
      const error = new Error(constants.loginAgain);
      error.statusCode = 404;
      throw error;
    }
    console.log('is Authenticated');
    req.userId = decodedToken.userId;
    // console.log('from Auth', req);
    next();
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
