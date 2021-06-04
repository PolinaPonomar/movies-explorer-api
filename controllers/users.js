const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

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

module.exports = { getCurrentUser, updateCurrentUser };
