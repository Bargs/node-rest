// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

var Sequelize = require("sequelize");
var sequelize = new Sequelize('dvdrental', 'postgres', 'password', {
    dialect: 'postgres',
    port:    5432
});

sequelize
    .authenticate()
    .complete(function(err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });

var Actor = sequelize.define('Actor', {
    actor_id: {type: Sequelize.INTEGER, primaryKey: true},
    first_name: Sequelize.STRING(45),
    last_name: Sequelize.STRING(45)
}, {
    tableName: 'actor',
    timestamps: true,
    createdAt: false,
    updatedAt: 'last_update'
});

sequelize
    .sync()
    .complete(function(err) {
        if (!!err) {
            console.log('An error occurred while creating the table:', err)
        } else {
            console.log('It worked!')
        }
    });

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/actors')

    // create an actor (accessed at POST http://localhost:8080/api/actors)
//    .post(function(req, res) {
//
//        var bear = new Bear(); 		// create a new instance of the Bear model
//        bear.name = req.body.name;  // set the bears name (comes from the request)
//
//        // save the bear and check for errors
//        bear.save(function(err) {
//            if (err)
//                res.send(err);
//
//            res.json({ message: 'Bear created!' });
//        });
//
//    })

    // get all the actors (accessed at GET http://localhost:8080/api/actors)
    .get(function(req, res) {
        Actor.findAll().success(function(actors) {

            res.json(actors.map(function(actor) {
                return actor.values;
            }));

        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);