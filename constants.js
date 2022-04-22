const {
  DATA_BASE = 'mongodb://localhost:27017/moviesdb',
  NODE_ENV = 'development',
  JWT_SECRET = 'some-secret-key',
  PORT = 3000,
} = process.env;

const SUCCESS_RESPONSE = 'Успешно!';
const DEFAULT_ERROR_RESPONSE = 'Произошла ошибка';
const BADREQUEST_ERROR_RESPONSE = 'Переданы некорректные данные';
const FORBIDDEN_ERROR_RESPONSE = 'Ошибка доступа';
const CONFLICT_ERROR_RESPONSE = 'Указанные данные уже есть в базе';
const NOTFOUND_ERROR_RESPONSE = 'Запрашиваемые данные в не найдены';
const UNAUTHORIZED_ERROR_RESPONSE = 'Передан неверный логин или пароль';
const SERVER_ERROR_RESPONSE = 'На сервере произошла ошибка.';
const WRONGURL_ERROR_RESPONSE = 'Не корректный URL';
const WRONGEMAIL_ERROR_RESPONSE = 'Не корректный E-mail';

module.exports = {
  DATA_BASE,
  NODE_ENV,
  JWT_SECRET,
  PORT,
  SUCCESS_RESPONSE,
  DEFAULT_ERROR_RESPONSE,
  BADREQUEST_ERROR_RESPONSE,
  FORBIDDEN_ERROR_RESPONSE,
  CONFLICT_ERROR_RESPONSE,
  NOTFOUND_ERROR_RESPONSE,
  UNAUTHORIZED_ERROR_RESPONSE,
  SERVER_ERROR_RESPONSE,
  WRONGURL_ERROR_RESPONSE,
  WRONGEMAIL_ERROR_RESPONSE,
};
