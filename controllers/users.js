const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const DefaultError = require('../errors/default-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// module.exports.createUser = (req, res, next) => {
//   const {
//     name,
//     about,
//     avatar,
//     email,
//     password,
//   } = req.body;

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные вместо id пользователя.');
      }
      throw err;
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные вместо id пользователя.');
      }
      throw err;
    })
    .catch(next);
};

// module.exports.login = (req, res, next) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign(
//         { _id: user._id },
//         NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
//         { expiresIn: '7d' },
//       );
//       res.send({ token: `Bearer ${token}` });
//     })
//     .catch(() => {
//       // ошибка аутентификации
//       throw new UnauthorizedError('Передан неверный логин или пароль.');
//     })
//     .catch(next);
// };
