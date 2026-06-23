const AppError = require('./../utils/AppError');

const handleCastErrorDB = (err) => {
  // err.message = `Invalid ${err.path}: ${err.value}.`;
  // err.isOperational = true;
  // err.statusCode = 400;

  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);

  // return err;
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // err.message = `Duplicate field value: ${value}. Please use another value!`;
  // err.isOperational = true;
  // err.statusCode = 400;
  // return err;

  return new AppError(
    `Duplicate field value: ${value}. Please use another value!`,
    400,
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // err.message = `Invalid input data. ${errors.join('. ')}`;
  // err.isOperational = true;
  // err.statusCode = 400;
  // return err;

  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    operational: err.isOperational,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    if (err.name === 'CastError') err = handleCastErrorDB(err);

    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    // if (error.name === 'JsonWebTokenError') error = handleJWTError();
    // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(err, res);
  }
};
