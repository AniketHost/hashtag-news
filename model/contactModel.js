const mongoose = require('mongoose');
const Contact = require('./contactModel');


const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },

},{timestamps:true});

module.exports = mongoose.model('Contact', contactSchema);
