const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const DefaultError = require('../errors/default-err');
const {
  JWT_SECRET,
  DEFAULT_ERROR_RESPONSE,
  BADREQUEST_ERROR_RESPONSE,
  CONFLICT_ERROR_RESPONSE,
  NOTFOUND_ERROR_RESPONSE,
  UNAUTHORIZED_ERROR_RESPONSE,
} = require('../constants');

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BADREQUEST_ERROR_RESPONSE));
      }
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_RESPONSE));
      }
      next(new DefaultError(DEFAULT_ERROR_RESPONSE));
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOTFOUND_ERROR_RESPONSE));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOTFOUND_ERROR_RESPONSE));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.codeName === 'DuplicateKey') {
        next(new ConflictError(CONFLICT_ERROR_RESPONSE));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BADREQUEST_ERROR_RESPONSE));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError(BADREQUEST_ERROR_RESPONSE));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token: `Bearer ${token}` });
    })
    .catch(() => {
      next(new UnauthorizedError(UNAUTHORIZED_ERROR_RESPONSE));
    });
};
