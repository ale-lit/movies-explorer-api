const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const { getUserMe, updateUser } = require('../controllers/users');

usersRouter.get('/users/me', getUserMe);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = usersRouter;
