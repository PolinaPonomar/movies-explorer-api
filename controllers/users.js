const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');

const SOLT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;

const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => User.findOne({ email }).select('-password'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else if (err.name === 'MongoError' && err.code === MONGO_DUPLICATE_ERROR_CODE) {
        throw new ConflictError('Пользователь с переданным email уже существует');
      }
      throw err;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный _id пользователя');
      }
      throw err;
    })
    .catch(next);
};

const updateCurrentUser = (req, res, next) => { // пароль нельзя менять?
  const update = {}; // объект, в который запишутся только те поля, которые хочет обновить юзер
  const { name, email } = req.body;
  if (name !== undefined) { update.name = name; }
  if (email !== undefined) { update.email = email; }
  User.findByIdAndUpdate(
    req.user._id,
    update,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный _id пользователя');
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  registerUser, login, getCurrentUser, updateCurrentUser,
};
