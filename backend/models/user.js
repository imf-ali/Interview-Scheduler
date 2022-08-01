const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../constants');

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: constants.userType
  }
},

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports = mongoose.model('User', userSchema);
