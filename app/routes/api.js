var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

  var apiRouter = express.Router();

  // route to generate sample user
  apiRouter.post('/sample', function(req, res) {

    // look for the user named chris
    User.findOne({
      'username': 'chris'
    }, function(err, user) {

      // if there is no chris user, create one
      if (!user) {
        var sampleUser = new User();

        sampleUser.name = 'Chris';
        sampleUser.username = 'chris';
        sampleUser.password = 'supersecret';
        sampleUser.credits = 2000;
        sampleUser.attack = 100;
        sampleUser.defence = 100;
        sampleUser.speed = 100;
        sampleUser.shipName = 'Maximus 2';
        sampleUser.shipNum = 10;
        sampleUser.upgradePrice = null;
        sampleUser.upgradeShipNum = 11;
        sampleUser.upgradeName = null;
        sampleUser.upgradeAttack = null;
        sampleUser.upgradeDefence = null;
        sampleUser.upgradeSpeed = null;


        sampleUser.save();
      } else {
        console.log(user);

        // if there is a chris, update his password
        user.password = 'supersecret';
        user.save();
      }

    });

  });

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRouter.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user) {

      if (err) throw err;

      // no user with that username was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {

        // check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign({
            id: user._id,
            name: user.name,
            username: user.username
          }, superSecret, {
            expiresIn: '24h' // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }

      }

    });
  });

  // route middleware to verify a token
  apiRouter.use(function(req, res, next) {
    // do logging
    console.log('Somebody just came to our app!');

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {

        if (err) {
          res.status(403).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;

          next(); // make sure we go to the next routes and don't stop here
        }
      });

    } else {

      // if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  });

  // test route to make sure everything is working
  // accessed at GET http://localhost:8080/api
  apiRouter.get('/', function(req, res) {
    res.json({
      message: 'hooray! welcome to our api!'
    });
  });

  // on routes that end in /users
  // ----------------------------------------------------
  apiRouter.route('/users')

    // create a user (accessed at POST http://localhost:8080/users)
    .post(function(req, res) {

      var user = new User(); // create a new instance of the User model
      user.name = req.body.name; // set the users name (comes from the request)
      user.username = req.body.username; // set the users username (comes from the request)
      user.password = req.body.password; // set the users password (comes from the request)
      user.credits = 10000; //set the users money amount
      user.attack = 6;
      user.defence = 8;
      user.speed = 4;
      user.shipName = 'Parvus';
      user.shipNum = 1;
      user.upgradePrice = 500;
      user.upgradeShipNum = 2;
      user.upgradeName = 'Parvus 2';
      user.upgradeAttack = 10;
      user.upgradeDefence = 12;
      user.upgradeSpeed = 8;

      user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({
              success: false,
              message: 'A user with that username already exists. '
            });
          else
            return res.send(err);
        }

        // return a message
        res.json({
          message: 'User created!'
        });
      });

    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {

      User.find({}, function(err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
      });
    });

  // on routes that end in /users/:user_id
  // ----------------------------------------------------
  apiRouter.route('/users/:user_id')

    // get the user with that id
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // return that user
        res.json(user);
      });
    })

    // update the user with this id
    .put(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;
        if (req.body.credits) user.credits = req.body.credits;
        if (req.body.attack) user.attack = req.body.attack;
        if (req.body.defence) user.defence = req.body.defence;
        if (req.body.speed) user.speed = req.body.speed;
        if (req.body.shipName) user.shipName = req.body.shipName;
        if (req.body.shipNum) user.shipNum = req.body.shipNum;
        if (reg.body.upgradePrice) user.upgradePrice = reg.body.upgradePrice;
        if (reg.body.upgradeShipNum) user.upgradeShipNum = reg.body.upgradeShipNum;
        if (reg.body.upgradeName) user.upgradeName = reg.body.upgradeName;
        if (reg.body.upgradeAttack) user.upgradeAttack = reg.body.upgradeAttack;
        if (reg.body.upgradeDefence) user.upgradeDefence = reg.body.upgradeDefence;
        if (reg.body.upgradeSpeed) user.upgradeSpeed = reg.body.upgradeSpeed;

        // save the user
        user.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({
            message: 'User updated!'
          });
        });

      });
    })

    // delete the user with this id
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);

        res.json({
          message: 'Successfully deleted'
        });
      });
    });

    // on routes that end in /users/:user_id/market
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id/market')

    // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {

                if (err) res.send(err);



                if(user.credits >= user.upgradePrice){
                    console.log("passed price check ");
                    if(user.shipNum < 10){
                        console.log("passed upgrade check ");
                        user.credits = user.credits - user.upgradePrice;
                        user.attack = user.upgradeAttack;
                        user.defence = user.upgradeDefence;
                        user.speed = user.upgradeSpeed;
                        user.shipName = user.upgradeName;

                        if(user.shipNum == 1){

                            console.log("in ship 1");
                            user.upgradePrice = 1000;
                            user.upgradeName = 'Vexillum';
                            user.upgradeAttack = 19;
                            user.upgradeDefence = 21;
                            user.upgradeSpeed = 18;

                        }else if(user.shipNum == 2){

                            user.upgradePrice = 1250;
                            user.upgradeName = 'Vexillum 2';
                            user.upgradeAttack = 36;
                            user.upgradeDefence = 38;
                            user.upgradeSpeed = 22;

                        }else if(user.shipNum == 3){

                            user.upgradePrice = 1500;
                            user.upgradeName = 'Vexillum 3';
                            user.upgradeAttack = 42;
                            user.upgradeDefence = 49;
                            user.upgradeSpeed = 49;

                        } else if(user.shipNum == 4){

                            user.upgradePrice = 1500;
                            user.upgradeName = 'Magna';
                            user.upgradeAttack = 60;
                            user.upgradeDefence = 59;
                            user.upgradeSpeed = 55;

                        }else if(user.shipNum == 5){

                            user.upgradePrice = 2000;
                            user.upgradeName = 'Magna 2';
                            user.upgradeAttack = 71;
                            user.upgradeDefence = 68;
                            user.upgradeSpeed = 70;

                        }else if(user.shipNum == 6){

                            user.upgradePrice = 3000;
                            user.upgradeName = 'Magna 3';
                            user.upgradeAttack = 79;
                            user.upgradeDefence = 75;
                            user.upgradeSpeed = 78;

                        }else if(user.shipNum == 7){

                            user.upgradePrice = 5000;
                            user.upgradeName = 'Maxiums';
                            user.upgradeAttack = 87;
                            user.upgradeDefence = 91;
                            user.upgradeSpeed = 88;

                        }else if(user.shipNum == 8){

                            user.upgradePrice = 5000;
                            user.upgradeName = 'Maxiums 2';
                            user.upgradeAttack = 100;
                            user.upgradeDefence = 100;
                            user.upgradeSpeed = 100;

                        }else if(user.shipNum == 9){

                            user.upgradePrice = null;
                            user.upgradeName = 'No More Upgrades' ;
                            user.upgradeAttack = null;
                            user.upgradeDefence = null;
                            user.upgradeSpeed = null;

                        }

                        user.shipNum = user.upgradeShipNum;
                        user.upgradeShipNum = user.upgradeShipNum+1;
                    }

                }


                // save the user
                user.save(function(err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'User updated!'
                    });
                });


            });

        })
// on routes that end in /users/:user_id/match
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id/match')

    // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {

                if (err) res.send(err);



                // save the user
                user.save(function(err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'User updated!'
                    });
                });


            });

        })


    // on routes that end in /users/:user_id/matchResult/:vs_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id/matchResult/:opponent_id')

    // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })


        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {

                if (err) res.send(err);



                // save the user
                user.save(function(err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({
                        message: 'User updated!'
                    });
                });


            });

        })






  // api endpoint to get user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};