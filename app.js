const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

require('./config/passport')(passport);  

const auth = require('./routes/auth');

app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});