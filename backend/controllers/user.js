const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
const fs = require('fs');

const User = require('../models/user');
const Jwttoken = require('../models/jwttoken');

// var TOKEN ="";

const savetoken = (token) => {
  Token = {
    token: `Bearer ${token}`,
  }
  const dataJSON = JSON.stringify(Token);
  fs.writeFileSync('token.json',dataJSON)
}

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(constants.validationFail);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const {email, name, password, phone, type} = req.body;
  
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPw,
        phone: phone,
        type: type
      });
      return user.save();
      // console.log('hey')
      // app.get('/user/ta_exec');
    })
    .then(result => {
      // res.redirect(307,'/user/ta_landing')
      res.status(201).json({ message: constants.userCreated, userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  // console.log(req.body)
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser, token;
  
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error(constants.notFoundUserWithEmail);
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error(constants.wrongPassword);
        error.statusCode = 401;
        throw error;
      }
      // console.log(loadedUser);
      token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        constants.SECRET,
        { expiresIn: '10h' }
      );
      savetoken(token);
      // TOKEN = token;
      // console.log(TOKEN);
      // req.header['Authorization'] = token;
      // console.log('here ',req.header['Authorization']);
      res.status(200).json({ token: token, userId: loadedUser._id.toString() ,type : loadedUser.type});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logout = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const error = new Error(constants.notAuthenticated);
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    const Token = new Jwttoken({
      token: token.toString()
    });
    Token.save()
    .then(result => {
      res.status(200).json({ message: constants.logoutSuccess, token: token });
    })
};

exports.TOKEN;
// module.exports = TOKEN;