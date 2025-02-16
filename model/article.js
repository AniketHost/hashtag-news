const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  img: String,
  article: String,
  headline : String,
  category : String,
  date: {
    type: Date,
    default: Date.now, // Set the default date to the current date and time
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
