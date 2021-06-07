const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandling = require('./middlewares/centralizedErrorHandling');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger); // логгер запросов
app.use(limiter);
app.use(helmet()); // простановкa security-заголовков
app.use(express.json()); // парсинг данных
app.use(router);
app.use(errorLogger); //  логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrorHandling); // централизованная обработка ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
