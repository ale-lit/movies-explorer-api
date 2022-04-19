const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const urlRegexpPattern = require('../regexp');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegexpPattern),
    trailer: Joi.string().required().pattern(urlRegexpPattern),
    thumbnail: Joi.string().required().pattern(urlRegexpPattern),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;
