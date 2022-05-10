require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { DATA_BASE, PORT, NOTFOUND_ERROR_RESPONSE } = require('./constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const allErrors = require('./middlewares/all-errors');
const NotFoundError = require('./errors/not-found-err');
const corsAllow = require('./middlewares/cors');

mongoose.connect(DATA_BASE);

const app = express();

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(corsAllow);

app.use(authRouter);

app.use(auth);

app.use(usersRouter);
app.use(moviesRouter);
app.use((req, res, next) => {
  next(new NotFoundError(NOTFOUND_ERROR_RESPONSE));
});

app.use(errorLogger);

app.use(errors());

app.use(allErrors);

app.listen(PORT);
