// SERVER.js

// --- base setup ---

// call pkgs we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var People = require('../people/models/people');

// connect to the DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@people-shard-00-00-lciud.mongodb.net:27017,people-shard-00-01-lciud.mongodb.net:27017,people-shard-00-02-lciud.mongodb.net:27017/people?ssl=true&replicaSet=people-shard-0&authSource=admin');
// mongoose.connect('mongodb://localhost/people');
// mongoose.connect('mongodb://people:testpeople@ds139430.mlab.com:39430/peopleapp');
// mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// --- routes for API ---

var router = express.Router(); // get an instance of the express router

// middlewear to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Changes made!');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome to my API!'
  });
});

// more routes for API here

// --- on routes that end in /people ---
router.route('/people')

// create a people (accessed at POST http://localhost:8080/api/people)
    .post(function(req, res) {

        var people = new People();     // create a new instance of the People model
        people.name = req.body.name;  // set the people name (comes from the request)
        people.favoriteCity = req.body.favoriteCity; // set the people city

        // save the people and check for errors
        people.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'People created!' });
        });

    })

    .get(function (req, res) {
       People.find(function (err, people) {
           if (err) {
               res.send(err);
           }
           res.json(people);
       })
    });

// --- on routes that end in /people/:people_id ---

router.route('/people/:people_id')
// get the people with that id (accessed at GET http://localhost:8080/api/people/:people_id)
    .get(function (req, res) {
        People.findById(req.params.people_id, function (err, people) {
            if (err) {
                res.send(err);
            }
            res.json(people);
        })
    })
    // update the people with this id (accessed at PUT http://localhost:8080/api/people/:people_id)
    .put(function (req, res) {
        People.findById(req.params.people_id, function (err, people) {
           if (err) {
               res.send(err);
           }
           // update the people's info
           people.name = req.body.name;
           people.favoriteCity = req.body.favoriteCity;
           // save the people's info
           people.save(function (err) {
               if (err) {
                   res.send(err);
               }
               res.json({ message: 'People updated!' });
           });
        });
    })

    // delete the people with this id (accessed at DELETE http://localhost:8080/api/people/:people_id)
    .delete(function (req, res) {
       People.remove(
           {
               _id: req.params.people_id
           }, function (err, people) {
               if(err) {
                   res.send(err);
               }
               res.json({ message: 'People deleted!' });
           }
        );
    });

// --- register routes ---
// all of the routes will be prefixed with /api
app.use('/api', router);

// --- start the server ---
app.listen(port);
console.log('Running on port ' + port);
