require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/router');

const { PORT, DATA_BASE, SECRET_KEY } = process.env;

const app = express();

app.use(cors());

mongoose.connect(DATA_BASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(helmet());
app.use(requestLogger); // логгер запросов
app.use(router);
app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработка ошибок celebrate
app.use(errorHandler); // центтрализованная обработка ошибок

app.listen(PORT);
