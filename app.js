require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandling = require('./middlewares/centralizedErrorHandling');
const MONGO_URL = require('./config');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(requestLogger); // логгер запросов
app.use(limiter); // защита от DoS-атак
app.use(helmet()); // простановкa security-заголовков
app.use(express.json()); // парсинг данных
app.use(router);
app.use(errorLogger); //  логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrorHandling); // централизованная обработка ошибок

app.listen(PORT);
