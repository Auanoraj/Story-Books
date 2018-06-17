const express = require('express');
const router = express.Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const { User, validateUser } = require('../models/User');

// Registration Process
router.post('/register', async(req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    if (user) return res.status(400).send('Email already exists');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const result = await user.save();
    res.send(result);
});

// Login Process
router.post('/login', async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid Email');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password')

    const token = jwt.sign({ _id: user._id, name: user.name, isAdmin: user.isAdmin }, keys.secretKey, { expiresIn: 3600 });

    res.send({
        success: true,
        token: 'Bearer ' + token
        });
});

// Logout Process
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;