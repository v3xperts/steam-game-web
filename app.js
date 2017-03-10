var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var flash = require('express-flash');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var SteamStrategy = require('./lib/passport-steam/').Strategy;
var localStrategy = require('passport-local' ).Strategy;


var users = require('./routes/users');
var owners = require('./routes/owners');
var index = require('./routes/index');
var pages = require('./routes/pages');
var groupmember = require('./routes/groupmember');
var steam = require('./routes/steam');
var api = require('./routes/api');


var Owner = require('./model/Owner.js');

var app = express();
var sessionStore = new session.MemoryStore;

// view engine setup
app.set('views', path.join(__dirname, '/views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

var db  = mongoose.connect('mongodb://localhost:27017/esportelation');
app.use(function(req,res,next){
    req.db = db;
    next();
});


/*mail configure start*/
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "logindharam@gmail.com",
       pass: "dellcomputers"
   }
});
app.use(function(req, res, next) {
    req.mail = smtpTransport;
    next();
});
/*mail configure stop*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(flash());
app.use(require('express-session')({
    //cookie: { maxAge: 600000 },
    // cookie: { expires: new Date(253402300000000)},
    // store: sessionStore,
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

app.use(function(req, res, next){
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(Owner.authenticate()));
// passport.serializeUser(Owner.serializeUser());
// passport.deserializeUser(Owner.deserializeUser());

passport.serializeUser(function(user, done) {
    Owner.serializeUser();
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
    Owner.deserializeUser();
  done(null, obj);
});

passport.use(new SteamStrategy({
    // returnURL: 'http://localhost:4001/auth/steam/return',
    // realm: 'http://localhost:4001/',
    returnURL: 'http://35.166.62.106:4001/auth/steam/return',
    realm: 'http://35.166.62.106:4001/',
    apiKey: '68B8261C1AFE36CA4628BDD4623B625D'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));



app.get('/', function(req, res){
  console.log(req.user);
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/steamdata', function(req, res){
  res.json({'steam':req.user,'user':req.session.userData});
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    var data = {};
    data.steamCheck = true;
    data.steamData = req.user;
    Owner.findByIdAndUpdate(req.session.userData._id, data, function (err,updata) {
        //res.session.userData = data;
        res.redirect('/esportelation-frontend/#/profile');
    })
  });


app.use('/', index);
app.use('/users', users);
app.use('/owners', owners);
app.use('/pages', pages);
app.use('/groupmember', groupmember);
app.use('/steam', steam);
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}


module.exports = app;
