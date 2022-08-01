const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JWTTokenSchema = new Schema({
  token : {
    type: String,
    index: true
  }
});

module.exports = mongoose.model('JWTToken', JWTTokenSchema);
