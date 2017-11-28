const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  total: {
    type:  Number,
    default: 0,
  },
  host: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  today: {
    date: {
      type: Date,
      default: Date.now
    },
    count: {
      type:  Number,
      default: 0,
    }
  }
});

module.exports = mongoose.model('Counter', CounterSchema);
