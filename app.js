const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const todoRouter = require('./routes/todoRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server!`,
  //   });

  //   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  //   err.statusCode = 404;
  //   err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
