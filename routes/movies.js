const express = require('express');

const moviesRouter = express.Router();

moviesRouter.get('/', (req, res) => {
  res.send({ message: 'I am get /movies ' });
});
moviesRouter.post('/', (req, res) => {
  res.send({ message: 'I am post /movies' });
});
moviesRouter.delete('/movieId', (req, res) => {
  res.send({ message: 'I am delete /movies/movieId' });
});

module.exports = { moviesRouter };
