const { validationResult } = require('express-validator/check');
const constants = require('../constants');

const User = require('../models/user');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const userId = req.userId;
    User.findById(userId)
      .then(user => {
        if (!user) {
          const error = new Error(constants.notFoundUser);
          error.statusCode = 404;
          throw error;
        }
        
        if (user.type !== "ta_exec") {
            const error = new Error(constants.userNotTAE);
            error.statusCode = 422;
            throw error;
        }
    })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
      next();
  };