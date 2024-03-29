const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { errorMessages } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} - невалидный email', // необязательно, подобная строка прописывается автоматически
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // по умолчанию база данных не будет возвращать это поле
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, {
  versionKey: false, // избавляемся от поля "__v" в схеме
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errorMessages.Unauthorized));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(errorMessages.Unauthorized));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
