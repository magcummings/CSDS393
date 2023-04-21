let loggedIn = "";
let flightDay = "";
let flightHours = "";
let flightMinutes = "";
let direction = "";
let type = "";

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: '../server/db/csds393.db',
  },
  useNullAsDefault: true
})

// Retrieve all flights
exports.flightsAll = async (req, res) => {

  // Get all flights from database
  knex
    .select('*') // select all records
    .from('flight') // from 'flight' table
    .then(userData => {
      // Send books extracted from database in response
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving flights: ${err}` })
    })
}

// saving logged in users email to backend for use in sql queries 
exports.flightsRecieveEmail = async (req, res) => {
  loggedIn = req.body.email;
  res.json({ message: `Email saved successfully/` })
}

// Get flights for logged in user from database
exports.flightsPersonal = async (req, res) => {
  knex
    .select('*') // select all records
    .from('flight') // from 'flight' table
    .where('email', loggedIn)
    .then(userData => {
      // Send flight extracted from database in response
      //console.log(userData)
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving flights: ${err}` })
    })
}


// Create new flight
exports.flightCreate = async (req, res) => {
  flightDay = req.body.flighttime;
  //flightDay = flightDay.substring(10);
  flightHours = req.body.flighttime;
  flightMinutes = flightHours.substring(14, 16);
  flightHours = flightHours.substring(11,13);
  flightMinutes = parseInt(flightMinutes) + (parseInt(flightHours)*60);
  direction = req.body.direction;
  type = req.body.international;

    // Add new flight to database
    knex('flight')
      .insert({ // insert new record, a flight
        'email': req.body.email,
        'flighttime': req.body.flighttime,
        'direction': req.body.direction,
        'international': req.body.international,
        'comments': req.body.comments
      })
      .then(() => {
        // Send a success message in response
        res.json({ message: `Flight \'${req.body.trip_id}\' by ${req.body.email} created.` })
      })
      .catch(err => {
        // Send a error message in response
        res.json({ message: `There was an error creating ${req.body.email} flight: ${err}` })
      })
  }

  // get group for a submitted flight
exports.groupAll = async (req, res) => {
  console.log();
    knex('flight')
    .select('email')
    //.whereBetween('flighttime', '[datetime(flightDay, '+2 hours'), 'datetime(flightDay, -2 hours)'
      //knex.raw("ADDTIME(?,'+ 2 hours')", 'flightDay'),
      //knex.raw("ADDTIME(?,'- 2 hours')", 'flightDay'),
    //)
    .where('direction', direction)
    .then(userData => {
      // Send books extracted from database in response
      res.json(userData)
      loggedIn = req.body.email;
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving flights: ${err}` })
    })
}

// update comments for given trip in database
exports.putNewCommentsInDB = async (req, res) => {
  knex('flight')
  .update({
    comments: req.body.comments
  })
  .where({trip_id: req.body.tripID})
  .then(response => {
    // Send a success message in response
    res.json(response.userData);
    //res.json({ message: `Flight \'${req.query.trip_id}\' updated successfully.` })
  })
  .catch(err => {
    // Send a error message in response
    res.json({ message: `There was an error updating ${req.query.trip_id} flight: ${err}` })
  })
}