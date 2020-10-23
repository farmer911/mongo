const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  content: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
  }
})

module.exports = mongoose.model('Posts', postSchema);