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
    .post(function(req, res) {

        var actor = Actor.build({
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });

        actor
            .save()
            .complete(function(err) {
                if (!!err) {
                    console.log('The instance has not been saved:', err);
                } else {
                    console.log('We have a persisted actor now');
                    res.json({ message: 'Actor created!' });
                }
            });
    })

    // get all the actors (accessed at GET http://localhost:8080/api/actors)
    .get(function(req, res) {
        Actor.findAll().success(function(actors) {

            res.json(actors.map(function(actor) {
                return actor.values;
            }));

        });
    });

// on routes that end in /actors/:actor_id
// ----------------------------------------------------
router.route('/actors/:actor_id')

    // get the actor with that id (accessed at GET http://localhost:8080/api/actors/:actor_id)
    .get(function(req, res) {

        Actor
            .find({ where: { actor_id: req.params.actor_id } })
            .complete(function(err, actor) {
                if (!!err) {
                    console.log('An error occurred while searching for actor:', err)
                } else if (!actor) {
                    console.log('No user with the username "john-doe" has been found.')
                    res.json({ message: 'Actor not found!' });
                } else {
                    res.json(actor.values);
                }
        });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        Actor
            .update({
                first_name: req.body.first_name,
                last_name: req.body.last_name
            }, {
                actor_id: req.params.actor_id
            })

            .success(function() {
                res.json({ message: "Actor updated successfully!" });
            })

            .error(function (err) {
                console.log('An error occurred while searching for actor:', err);
            });
    });
//
//    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
//    .delete(function(req, res) {
//        Bear.remove({
//            _id: req.params.bear_id
//        }, function(err, bear) {
//            if (err)
//                res.send(err);
//
//            res.json({ message: 'Successfully deleted' });
//        });
//    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);