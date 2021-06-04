const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // почему число? есть дата но нет времени
    required: true,
  },
  year: {
    type: String, // почему строка?
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    // Запишите её URL-адресом дефолт?
  },
  trailer: {
    type: String,
    required: true,
    // Запишите её URL-адресом
  },
  thumbnail: {
    type: String,
    required: true,
    // Запишите её URL-адресом
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String, // ? содержится в ответе сервиса MoviesExplorer
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, {
  versionKey: false, // избавляемся от поля "__v" в схеме
});

module.exports = mongoose.model('movie', movieSchema);
