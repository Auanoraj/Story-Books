const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const error = require('./helpers/error');
const winston = require('winston');
require('./helpers/logging');

// Load User Model
require('./models/User');
require('./models/Story');

// Passport Config
require('./helpers/passport')(passport);

// Load Keys
const keys = require('./config/keys');

// Mongoose Connect
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Load Routes
const users = require('./routes/users');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || undefined;
  next();
});

// Use Routes
app.use('/', index);
app.use('/users', users);
app.use('/stories', stories);

app.use(error);

const port = process.env.PORT || 5000;

app.listen(port, 
  () => winston.info(`Listening on port ${port}...`));