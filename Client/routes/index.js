var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
// Defines the root route. router.get receives a path and a function
// The req object represents the HTTP request and contains
// the query string, parameters, body, header
// The res object is the response Express sends when it receives
// a request
// render says to use the views/index.jade file for the layout
// and to set the value for title to 'Express'
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Vehicle Hire' });
});

router.get('/vehiclelist', function(req, res){

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/sampsite';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('vehicles');

    // Find all vehicles
    collection.find({}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        res.render('vehiclelist',{
          // Pass the returned database documents to Jade
          "vehiclelist" : result 
        });
      } else {
        res.send('No documents found');
      }
      //Close connection
      db.close();
    });
  }
  });
});

router.get('/booking', function(req, res){
  res.render('booking', {title: 'Enter Your Details' });
});

router.post('/booking', function(req, res){

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/sampsite';

  // Connect to the server
  MongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      // Get the documents collection
      var collection = db.collection('bookings');

      // Get the vehicle data passed from the form
      var booking = {FirstName: req.body.FirstName, LastName: req.body.LastName, Age: req.body.Age, Email: req.body.Email, date: req.body.Date};

      // Insert the vehicle data into the database
      collection.insert([booking], function (err, result){
        if (err) {
          console.log(err);
        } else {

          if (booking.Age >= 25 ){
            // Get a Mongo client to work with the Mongo server
            var MongoClient = mongodb.MongoClient;

            // Define where the MongoDB server is
            var url = 'mongodb://localhost:27017/sampsite';

            // Connect to the server
            MongoClient.connect(url, function (err, db) {
            if (err) {
              console.log('Unable to connect to the Server', err);
            } else {
              // We are connected
              console.log('Connection established to', url);

              // Get the documents collection
              var collection = db.collection('vehicles');

              // Find all vehicles
              collection.find({}).toArray(function (err, result) {
                if (err) {
                  res.send(err);
                } else if (result.length) {
                  res.render('bookvehicle',{
                    // Pass the returned database documents to Jade
                    "vehiclelist" : result,
                    booking : booking 
                  });
                } else {
                  res.send('No documents found');
                }
                //Close connection
                db.close();
              });
            };
          });
          }
          else{
            // Get a Mongo client to work with the Mongo server
            var MongoClient = mongodb.MongoClient;

            // Define where the MongoDB server is
            var url = 'mongodb://localhost:27017/sampsite';

            // Connect to the server
            MongoClient.connect(url, function (err, db) {
            if (err) {
              console.log('Unable to connect to the Server', err);
            } else {
              // We are connected
              console.log('Connection established to', url);

              // Get the documents collection
              var collection = db.collection('vehicles');

              // Find all vehicles
              collection.find({type:"Small Town Car"}).toArray(function (err, result) {
                if (err) {
                  res.send(err);
                } else if (result.length) {
                  res.render('bookvehicle',{
                    // Pass the returned database documents to Jade
                    "vehiclelist" : result,
                    booking : booking 
                  });
                } else {
                  res.send('No documents found');
                }
                //Close connection
                db.close();
              });
            }
            });
          }
        }
        // Close the database
        db.close();
      });

    }
  });
});

router.post('/bookvehicle', function(req, res){

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/sampsite';

  // Connect to the server
  MongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      // Get the documents collection
      var collection = db.collection('bookedVehicle');

      // Get the vehicle data passed from the form
      var bookedVehicle = {firstName: req.body.FirstName, lastName: req.body.LastName, date: req.body.Date, daysBooked: req.body.numberOfDays, type: req.body.Type, fuel: req.body.Fuel, price: req.body.Price};

      console.log(bookedVehicle);
      // Insert the vehicle data into the database
      collection.insert([bookedVehicle], function (err, result){
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated vehicle list
          res.redirect("success");
        }

        // Close the database
        db.close();
      });

    }
  });

});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'BOOKING SUCCESSFUL' });
});

module.exports = router;