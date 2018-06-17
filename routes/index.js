const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const passport = require('passport');

router.get('/', (req, res) => {
  res.send('Welcome to Story Books.');
});

router.get('/dashboard', passport.authenticate('jwt', { session: true }), (req, res) => {
  Story.find({user:req.user.id})
  .then(stories => {
    res.send('Dashboard');
  }); 
});

router.get('/about', (req, res) => {
  res.send('About');
});

module.exports = router;