const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

// router.get('http://localhost:5000/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect('/dashboard');
//   });

module.exports = router;