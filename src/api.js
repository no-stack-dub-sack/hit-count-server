const prettyDate        = require('./utils/prettyDate');
const Counter           = require('./model.js');
const hostName          = require('./utils/hostName');
const getAverage        = require('./utils/getAverage');

module.exports = {
  registerCount: (req, res) => {
    const today = new Date();
    // reassign hostName to identify right mongodb record
    const filter  = { host: hostName(req.headers.referer) };
    const updater = { $inc: { 'total' : 1 } };
    const options = { new: true };
    // create intial record manually at CL rather than
    // creating new record when querry does not return
    // existing, so that new records aren't created by
    // outside users. clearly there are better authing
    // options, but this works for this simple purpose
    Counter.findOneAndUpdate(filter, updater, options, (err, count) => {
      if (count) {
        if (prettyDate(count.today.date) !== prettyDate(today)) {
          // record past hits; beginning Feb. 7th, 2018
          count.past.push({
            date: prettyDate(count.today.date),
            count: count.today.count
          })
          // reset count
          count.today.date = today;
          count.today.count = 1;
        } else {
          count.today.count++;
        }
        count.save(err => {
          if (err) {
            console.error('Error updating hit-count-server:');
            console.error(err);
            res.status(500);
          } else {
            console.log('Count updated!');
            res.end();
          }
        });
      }
      res.end();
    });
  },
  getCount: (req, res) => {
    const today = new Date();
    const host = hostName(req.params.id);
    Counter.findOne({ host }, (err, doc) => {
      if (err) res.send('An error occurred... T_T');
      if (!doc) {
        res.send('No one visited yet... very depressing. (っ- ‸ – ς)');
      } else {
        const { total, startDate, today: { count, date: lastHitDate } } = doc;
        const average = getAverage(startDate, today, total);
        // if date of last recorded hit is different than today's
        // date no one has visited today, show zero hits instead
        let isZero = false;
        if (prettyDate(lastHitDate) !== prettyDate(today)) {
          isZero = true;
        }
        res.send({
          totalCount: total,
          startDate: prettyDate(startDate),
          currentDate: prettyDate(today),
          todaysCount: isZero ? 0 : count,
          average,
          host
        });
      }
    });
  }
}
