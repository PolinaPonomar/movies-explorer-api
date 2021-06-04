const Movie = require('../models/movie');

const getMovies = (req, res) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      res.status(500).send({ maessage: err });
    });
};

const postMovie = (req, res) => {
  const owner = req.user._id;
  const newMovie = { ...req.body, owner };
  Movie.create(newMovie)
    .then((movie) => {
      Movie.findById(movie._id).populate(['owner'])
        .then((fullVersionMovie) => res.send(fullVersionMovie))
        .catch((err) => {
          res.status(500).send({ maessage: err });
        });
    })
    .catch((err) => {
      res.status(500).send({ maessage: err });
    });
};

const deleteMovie = (req, res) => {
  Movie.findOneAndRemove({ owner: req.user, _id: req.params.movieId })
    .then((movie) => {
      if (movie) {
        res.send({ message: 'Фильм удален' });
      } else {
        res.send('Фильм не найден');
      }
    })
    .catch((err) => {
      res.status(500).send({ maessage: err });
    });
};

module.exports = { getMovies, postMovie, deleteMovie };
