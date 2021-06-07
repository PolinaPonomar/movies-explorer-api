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
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден'))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new Forbidden('Нет прав на удаление фильма');
      } else {
        return movie.remove()
          .then(() => res.send({ message: 'Фильм удален' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, postMovie, deleteMovie };
