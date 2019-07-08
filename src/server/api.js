var express = require('express');
var passport = require('passport');
var cors = require('cors');
var app = express();

app.use(cors());
require('dotenv').config();

var cookieParser = require('cookie-parser');
var session = require('express-session');

var BnetStrategy = require('passport-bnet').Strategy;
var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new BnetStrategy(
    {
      clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      scope: 'wow.profile',
      callbackURL: 'http://localhost:3001/auth/bnet/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);

app.use(cookieParser());
app.use(session({ secret: 'blizzard', saveUninitialized: true, resave: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/bnet', passport.authenticate('bnet'));

app.get(
  '/auth/bnet/callback',
  passport.authenticate('bnet', { failureRedirect: '/' }),
  function(req, res) {
    if (req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.send('<a href="/auth/bnet">Login with Bnet</a>');
    }
  }
);

app.get('/', function(req, res) {
  res.send('<a href="/auth/bnet">Login with Bnet</a>');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var server = app.listen(3001, function() {
  console.log('Listening on port %d', server.address().port);
});
