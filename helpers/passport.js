const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const { User } = require('../models/User');
const keys = require('../config/keys');
const passport = require('passport');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async(jwt_payload, done) => {
            let user = await User.findById(jwt_payload._id);
            
            if (!user) return done(null, false);

            return done(null, user);
        })
    );
};