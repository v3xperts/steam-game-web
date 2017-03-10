var express = require('express');
var router = express.Router();
var passport = require('passport');

var Owner = require('../model/Owner.js');


router.post('/register', function(req, res) {
  Owner.register(new Owner(req.body),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, Owner, info) {
    if (err) {
      return next(err);
    }
    if (!Owner) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(Owner, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in Owner'
        });
      }
      req.session.userData = Owner;
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});


router.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    console.log(req.session.userData);
    Owner.findById(req.session.userData._id, function (err,updata) {
        console.log(updata);
        res.status(200).json({
            data:updata,
            status: true
        });
    });
});


module.exports = router;