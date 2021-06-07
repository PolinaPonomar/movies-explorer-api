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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoError' && err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с переданным email уже существует'));
      } else {
        next(err);
      }
    });
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
      return res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
};

const updateCurrentUser = (req, res, next) => {
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
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  registerUser, login, getCurrentUser, updateCurrentUser,
};
