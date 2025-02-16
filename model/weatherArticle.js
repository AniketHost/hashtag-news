const mongoose = require('mongoose');

const weatherarticleSchema = new mongoose.Schema({
  img: String,
  article: String,
  headline : String,
  category : String,
  date: {
    type: Date,
    default: Date.now, // Set the default date to the current date and time
  },
});

const newWeatherArticle = mongoose.model('WeatherArticle', weatherarticleSchema);

module.exports = newWeatherArticle;
