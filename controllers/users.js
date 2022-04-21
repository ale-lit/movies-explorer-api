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

  User.find({ email })
    .then((result) => {
      if (result.length === 0) {
        bcrypt
          .hash(password, 10)
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
              throw new BadRequestError(BADREQUEST_ERROR_RESPONSE);
            }
            throw new DefaultError(DEFAULT_ERROR_RESPONSE);
          })
          .catch(next);
      } else {
        throw new ConflictError(CONFLICT_ERROR_RESPONSE);
      }
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOTFOUND_ERROR_RESPONSE);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(BADREQUEST_ERROR_RESPONSE);
      }
      throw err;
    })
    .catch(next);
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
        throw new NotFoundError(NOTFOUND_ERROR_RESPONSE);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.codeName === 'DuplicateKey') {
        throw new ConflictError(CONFLICT_ERROR_RESPONSE);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(BADREQUEST_ERROR_RESPONSE);
      }
      if (err.name === 'CastError') {
        throw new BadRequestError(BADREQUEST_ERROR_RESPONSE);
      }
      throw err;
    })
    .catch(next);
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
      throw new UnauthorizedError(UNAUTHORIZED_ERROR_RESPONSE);
    })
    .catch(next);
};
