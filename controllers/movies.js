const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

const postMovie = (req, res, next) => {
  const owner = req.user._id;
  const newMovie = { ...req.body, owner };
  Movie.create(newMovie)
    .then((movie) => {
      Movie.findById(movie._id).populate(['owner'])
        .then((MovieWithOwner) => res.send(MovieWithOwner))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма');
      }
      throw err;
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findOneAndRemove({ owner: req.user, _id: req.params.movieId })
    .then((movie) => {
      if (movie) {
        res.send({ message: 'Фильм удален' });
      } else {
        Movie.findById(req.params.movieId)
          .then((notDeletedMovie) => {
            if (notDeletedMovie) {
              throw new Forbidden('Нет прав на удаление фильма');
            } else {
              throw new NotFoundError('Фильм с указанным _id не найден');
            }
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный _id фильма');
      }
      throw err;
    })
    .catch(next);
};

module.exports = { getMovies, postMovie, deleteMovie };
