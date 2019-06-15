require('./config/config');


//MELI.init({ client_id: process.env.MERCADO_CLIENT});

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');

const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use(express.static(path.resolve(__dirname,'../public')));

app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (error, resp) => {
    if (error) throw error;
    console.log('Base de datos online');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', 3000);
});

// PRUEBA MERCADO LIBRE

var MercadoLibreStrategy = require('passport-mercadolibre').Strategy;

passport.use(new MercadoLibreStrategy({
    clientID: process.env.MERCADO_CLIENT,
    clientSecret: process.env.SECRET_KEY,
    callbackURL: process.env.CALLLBACK_URL,
  },
  function (accessToken, refreshToken, profile, done) {
    // + store/retrieve user from database, together with access token and refresh token
    return done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


app.get('/auth/mercadolibre',
  passport.authorize('mercadolibre'));

app.get('/auth/mercadolibre/callback',
  passport.authorize('mercadolibre', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/', ensureAuthenticated,
  function(req, res) {
    res.send("Logged in user: " + req.user.nickname);
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect('/auth/mercadolibre');
};