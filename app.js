const express = require('express');
const app = express();
const todoRouter = require('./routes/todoRoutes');
const morgan = require('morgan');

app.use(express.json());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/todos', todoRouter);

module.exports = app;
