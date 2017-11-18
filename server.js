const bodyParser        = require('body-parser');
const calculateDayRange = require('./calculateDayRange');
const Counter           = require('./model.js');
const dotenv            = require('dotenv');
const express           = require('express');
const mongoose          = require('mongoose');
const prettyDate        = require('./prettyDate');
dotenv.config();

// date from which to begin counting hits
const START_DATE = new Date(2017, 10, 18);

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
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  if (req.connection.remoteAddress !== '::ffff:10.43.224.30') {
    Counter.findOneAndUpdate({}, {}, options, (err, doc) => {
      if (doc) {
        doc.total++;
        doc.host = req.headers.referer;
        doc.save(err => {
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
  } else {
    console.log('not counting owner\'s visit!');
    res.end();
  }
});

app.get('/get-count', (req, res) => {
    Counter.findOne({}, (err, doc) => {
    if (err) res.send('An error occurred... T_T');
    if (!doc) {
      res.send('No one visited yet... very depressing. (っ- ‸ – ς)');
    } else {
      const { total, host } = doc;
      let average = Math.floor(total / calculateDayRange(START_DATE, CURRENT_DATE));
      // show average on day 1 as total day 1 count
      average = average !== Infinity ? average : total;
      res.send({
        total,
        startDate: prettyDate(START_DATE),
        currentDate: prettyDate(CURRENT_DATE),
        average,
        host
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
