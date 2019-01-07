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
  res.render('index', { title: 'Administration' });
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

router.get('/allbookings', function(req, res){

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
    var collection = db.collection('bookedVehicle');

    // Find all vehicles
    collection.find({}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        res.render('allbookings',{
          // Pass the returned database documents to Jade
          "bookedVehicles" : result 
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

// Route to the page we can add vehicle from using newvehicle.jade
router.get('/newvehicle', function(req, res){
    res.render('newvehicle', {title: 'Add Vehicle' });
});

router.get('/admin', function(req, res){
  res.render('admin', {title: 'Admin' });
});

router.post('/addvehicle', function(req, res){

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
        var collection = db.collection('vehicles');

        // Get the vehicle data passed from the form
        var vehicle = {type: req.body.Type, fuel: req.body.Fuel, price: req.body.Price};

        // Insert the vehicle data into the database
        collection.insert([vehicle], function (err, result){
          if (err) {
            console.log(err);
          } else {

            // Redirect to the updated vehicle list
            res.redirect("vehiclelist");
          }

          // Close the database
          db.close();
        });

      }
    });

  });

module.exports = router;