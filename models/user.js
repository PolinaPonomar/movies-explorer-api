const mongoose = require('mongoose');
const validator = require('validator');

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
    select: false, // по умолчанию  база данных не возвращает это поле
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

module.exports = mongoose.model('user', userSchema);
