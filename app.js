const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { registerUser, login } = require('./controllers/users');
const { usersRouter } = require('./routes/users');
const { moviesRouter } = require('./routes/movies');
const centralizedErrorHandling = require('./middlewares/centralizedErrorHandling');
const NotFoundError = require('./errors/not-found-err');

// Слушаем 3000 порт
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// парсинг данных
app.use(express.json());

// подключаем логгер запросов
app.use(requestLogger);

app.post('/signup', registerUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use(() => { throw new NotFoundError('Ресурс не найден'); }); // подумать над красотой

// подключаем логгер ошибок
app.use(errorLogger);
// централизованная обработка ошибок
app.use(centralizedErrorHandling); // ErrorHander

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
