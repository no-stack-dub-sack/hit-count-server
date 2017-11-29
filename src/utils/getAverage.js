const calculateDayRange = require('./calculateDayRange');

const getAverage = (start, current, total) => {
  let avg = Math.floor(total / calculateDayRange(start, current));
  return avg !== Infinity ? avg : total;
}

module.exports = getAverage;
