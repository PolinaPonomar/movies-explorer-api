const express = require('express');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieBody, validateMovieId } = require('../middlewares/validation');

const moviesRouter = express.Router();

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateMovieBody, postMovie);
moviesRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
