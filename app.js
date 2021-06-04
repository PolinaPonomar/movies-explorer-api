const express = require('express');
const mongoose = require('mongoose');
const { usersRouter } = require('./routes/users');
const { moviesRouter } = require('./routes/movies');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// парсинг данных
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '60ba1b66110a37c51dfa5e58', // ХАРДКОД
  };

  next();
});
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
