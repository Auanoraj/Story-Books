const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
});


const User = mongoose.model('users', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(7).required().strict(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
    });
  
    return Joi.validate(user, schema);
  }

exports.User = User;
exports.validateUser = validateUser;
