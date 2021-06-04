const User = require('../models/user');

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

const updateCurrentUser = (req, res) => { // пароль нельзя менять?
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
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

module.exports = { getCurrentUser, updateCurrentUser };
