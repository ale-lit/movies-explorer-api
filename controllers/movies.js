const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  SUCCESS_RESPONSE,
  DEFAULT_ERROR_RESPONSE,
  BADREQUEST_ERROR_RESPONSE,
  FORBIDDEN_ERROR_RESPONSE,
} = require('../constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(() => {
      next(new DefaultError(DEFAULT_ERROR_RESPONSE));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(BADREQUEST_ERROR_RESPONSE);
      }

      if (String(movie.owner) === req.user._id) {
        return movie.remove()
          .then(() => {
            res.status(200).send({ message: SUCCESS_RESPONSE });
          });
      }

      throw new ForbiddenError(FORBIDDEN_ERROR_RESPONSE);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BADREQUEST_ERROR_RESPONSE));
      }
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BADREQUEST_ERROR_RESPONSE));
      }
      next(new DefaultError(DEFAULT_ERROR_RESPONSE));
    });
};
