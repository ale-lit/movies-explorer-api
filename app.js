const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();

mongoose.connect('mongodb://localhost:27017/filmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(usersRouter);
app.use(moviesRouter);

app.listen(3000);
