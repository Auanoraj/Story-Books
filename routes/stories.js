const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
require('express-async-errors');

const { Story, validateStory } = require('../models/Story');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status:'public'})
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
      res.send(stories);
    });
});

// Stories sort by name
router.get('/', async (req, res) => {
  Story.find().sort('name')
    .populate('user')
    .then(stories => {
      res.send(stories);
    });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
  Story.findById({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
      res.send(stories);
    });
});

// Logged in users stories
router.get('/my', passport.authenticate('jwt', { session: false }), (req, res) => {
  Story.findById({user: req.user.id})
    .populate('user')
    .then(stories => {
      res.send(stories);
    });
});

// Add Story Process
router.post('/', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  const { error } = validateStory(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments:allowComments,
    user: req.user.id
  }

  // Create Story
  new Story(newStory)
    .save()                     
      .then(story => res.send(story))
      .catch(err => console.log(err));
});

// Edit & Update Process using async & await
router.put('/:id', passport.authenticate('jwt', { session: false }), 
async (req, res) => {
  const { error } = validateStory(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const story = await Story.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments: req.body.allowComments
    }, { new: true });

  if (!story) return res.status(404).send('The story with the given ID was not found.');
  
  res.send(story);
});

router.delete('/:id', passport.authenticate('jwt', { session: false }),
async (req, res) => {
  const story = await Story.findByIdAndRemove(req.params.id);

  if (!story) return res.status(404).send('The story with the given ID was not found.');

  res.send('The story has been deleted successfully.');
});

// Add Comment Process using async & await
router.put('/comment/:storyId', passport.authenticate('jwt', { session: false }),
async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id,
    {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
    }, { new: true });

    res.redirect('/dashboard');
  });

module.exports = router;




