const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const Forbidden = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const { errorMessages } = require('../utils/constants');
const { answerMessages } = require('../utils/constants');

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
        next(new BadRequestError(errorMessages.BadRequestBody));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError(errorMessages.NotFoundMovie))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id) {
        throw new Forbidden(errorMessages.Forbidden);
      } else {
        return movie.remove()
          .then(() => res.send({ message: answerMessages.movieDeleted }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.BadRequestId));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, postMovie, deleteMovie };
