const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  total: {
    type:  Number,
    default: 0,
  },
  siteName: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Counter', CounterSchema);