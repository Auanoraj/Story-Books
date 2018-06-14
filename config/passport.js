const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./key');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  (accessToken, refreshToken, profile, done) => {
    // User.findOrCreate({ googleId: profile.id }, (err, user) => {
    //   return done(err, user);
    // });
  }
))};
