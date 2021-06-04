const express = require('express');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movies');

const moviesRouter = express.Router();

moviesRouter.get('/', getMovies);
moviesRouter.post('/', postMovie);
moviesRouter.delete('/:movieId', deleteMovie);

module.exports = { moviesRouter };
