const { celebrate, Joi } = require('celebrate');
const moviesRouter = require('express').Router();
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { WRONGURL_ERROR_RESPONSE } = require('../constants');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(WRONGURL_ERROR_RESPONSE);
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(WRONGURL_ERROR_RESPONSE);
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(WRONGURL_ERROR_RESPONSE);
    }),
    movieId: Joi.number().required(),
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
