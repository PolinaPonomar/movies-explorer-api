const express = require('express');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation');
const { registerUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

const router = express.Router();

router.post('/signup', validateUserBody, registerUser);
router.post('/signin', validateAuthentication, login);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use(() => { throw new NotFoundError('Ресурс не найден'); });

module.exports = router;
