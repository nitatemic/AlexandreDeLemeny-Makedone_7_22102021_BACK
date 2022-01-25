require('dotenv').config();

const { PROTOCOL } = process.env;
// eslint-disable-next-line import/no-dynamic-require
const http = require(PROTOCOL);
const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':

      process.exit(1);
      break;
    case 'EADDRINUSE':

      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);

server.listen(port);
