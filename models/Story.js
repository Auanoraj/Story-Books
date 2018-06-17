const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

// Create Shema
const storySchema = new Schema({
  title:{
    type:String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  body:{
    type: String,
    required: true
  },
  status: {
    type: String,
    default:'public',
    required: true
  },
  allowComments: {
    type: Boolean,
    default:true
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{
      type: Schema.Types.ObjectId,
      ref:'users'
    }
  }],
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  date:{
    type: Date,
    default: Date.now
  },
  isAdmin: {
      type: Boolean,
      required: true,
      default: false
  }
});

const Story = mongoose.model('stories', storySchema);

function validateStory(stories) {
  const schema = Joi.object({
      title: Joi.string().min(5).max(2500).required(),
      body: Joi.string().required(),
      status: Joi.string().required(),
      allowComments: Joi.boolean().required(),
      isAdmin: Joi.boolean().required()
  });

  return Joi.validate(stories, schema);
}

exports.Story = Story;
exports.validateStory = validateStory;


