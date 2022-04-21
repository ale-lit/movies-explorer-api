const {
  DATA_BASE = 'mongodb://localhost:27017/moviesdb',
  NODE_ENV = 'development',
  JWT_SECRET = 'some-secret-key',
  PORT = 3000,
} = process.env;

module.exports = {
  DATA_BASE,
  NODE_ENV,
  JWT_SECRET,
  PORT,
};
