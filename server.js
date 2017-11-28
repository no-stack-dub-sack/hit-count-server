const bodyParser        = require('body-parser');
const calculateDayRange = require('./calculateDayRange');
const Counter           = require('./model.js');
const dotenv            = require('dotenv');
const express           = require('express');
const mongoose          = require('mongoose');
const prettyDate        = require('./prettyDate');
dotenv.config();

// date from which to begin counting hits
// const START_DATE = new Date(2017, 10, 18);

// today's date
const CURRENT_DATE = new Date();

const app = express(),
      production = process.env.NODE_ENV === 'production',
      PORT = production ? process.env.PORT : 5000,
      MONGO_URI = production
        ? process.env.MONGO_PROD_URI
        : process.env.MONGO_DEV_URI;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useMongoClient: true })
  .then(() => console.log('Mongoose connected'))
  .catch(err => console.error('Error connecting to MongoDB'));

app.use(bodyParser.json())

app.post('/register-count', (req, res) => {
  // reassign hostName if cs-playground-react is being accessed over https,
  // needs to be the http address to find the right record in the database
  const hostName = req.headers.referer === 'https://cs-playground-react.surge.sh/'
    ? 'http://cs-playground-react.surge.sh/'
    : req.headers.referer;
  // create intial record manually at CL rather than creating new record when querry
  // does not return existing, so that new records aren't created by outside users.
  // clearly there are better auth options, but this works for my simple purpose
  Counter.findOneAndUpdate(
    { host: hostName },
    { $inc: { 'total' : 1 } },
    { new: true },
  (err, count) => {
    if (count) {
      // update today's count or reset if it's no longer today
      if (prettyDate(count.today.date) !== prettyDate(CURRENT_DATE)) {
        count.today.date = CURRENT_DATE,
        count.today.count = 0;
      } else {
        count.today.count++;
      }
      // save record
      count.save(err => {
        if (err) {
          console.error('There was an error updating the hit-count-server...');
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
});

app.get('/get-count/:id', (req, res) => {
  const hostName = req.params.id === 'cs-playground-react'
    ? 'http://cs-playground-react.surge.sh/'
    : 'http://peterweinberg.me/';
  Counter.findOne({ host: hostName }, (err, doc) => {
    if (err) res.send('An error occurred... T_T');
    if (!doc) {
      res.send('No one visited yet... very depressing. (っ- ‸ – ς)');
    } else {
      const { total, host, startDate, today: { count } } = doc;
      let average = Math.floor(total / calculateDayRange(startDate, CURRENT_DATE));
      // show average on day 1 as total day 1 count
      average = average !== Infinity ? average : total;
      res.send({
        totalCount: total,
        startDate: prettyDate(startDate),
        currentDate: prettyDate(CURRENT_DATE),
        todaysCount: count,
        average,
        host,
      });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Sophisticated counter app listening on port ${PORT}!`);
});

// 18325
