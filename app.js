'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const cors = require('cors');

// importing Sequelize instance from models index
const { sequelize } = require('./models');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup top level application body parsing using native express middleware
app.use(express.json());
app.use(express.urlencoded());

// allow CORS requests using 'cors' package as top level method for app
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup requirement for /api to retrieve api data
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// try to authenticate connection to database, console the error if unable to authenticate
(async function (){
  try {
  await sequelize.authenticate();
  console.log('Connection to database has been established!');
  await sequelize.sync();
  console.log('Databases have synced');
} catch (error){
  console.error(`Failed to connect to database: ${error}`);
}
}());