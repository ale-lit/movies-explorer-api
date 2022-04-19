const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(() => {
      next(new DefaultError('Произошла ошибка'));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Передан несуществующий id фильма.');
      }

      if (String(movie.owner) === req.user._id) {
        Movie.findByIdAndRemove(req.params.id)
          .then(() => {
            res.status(200).send({ message: 'Фильм удалён' });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError('Передан некорректный id фильма.');
            }
            throw new DefaultError('Произошла ошибка.');
          });
      } else {
        throw new ForbiddenError('Вы не являетесь создателем данного фильма.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный id фильма.');
      }
      throw err;
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
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
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при добавлении фильма.',
        );
      }
      throw new DefaultError('Произошла ошибка');
    })
    .catch(next);
};
