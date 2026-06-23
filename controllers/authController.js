const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),

    // httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);

  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     user: newUser,
  //     JWTtoken: token,
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  //1) check if email and password exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3)if every thing ok, send token

  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user,
  //   },
  // });
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1- Getting token and check if it's there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log(req.headers.authorization.split(' ')[1]);
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    console.log(req.cookies.jwt);

    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }
  // 2- Verification token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // 3- Check if user still exists.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist!',
        401,
      ),
    );
  }
  // 4- Check if user changed password after the token was issued.
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please log in again', 401),
    );
  }

  // 5- Grant access to protected route.
  req.user = currentUser;
  // console.log(req.user._id);
  next();
});

exports.restrictTo = (...roles) => {
  // 1- We get the req.user from the protect method
  return (req, res, next) => {
    // Check req.user.role in my roles or no.
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403),
      );
    }
    // 3- If in my roles then call next()
    next();
  };
};

exports.isOwner = (model) => {
  return catchAsync(async (req, res, next) => {
    if (req.params.id) {
      let filter = {};
      if (req.params.id) filter = { _id: req.params.id };

      const doc = await model.findById(filter);

      if (!doc) {
        return next(new AppError('No todo found with that ID', 404));
      }

      if (!doc.user.equals(req.user.id)) {
        return next(
          new AppError("You don't have permission to perform this action", 403),
        );
      }
    } else if (req.body.user) {
      if (req.body.user !== req.user.id) {
        console.log(req.body.user, req.user.id);
        return next(
          new AppError("You don't have permission to perform this action", 403),
        );
      }
    }
    next();
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1- Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email', 404));
  }
  // 2- Generate the random reset token with crypto module in instant method
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3- Send it to user email with node mailer.

  res.status(200).json({
    status: 'success',
    resetToken,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1- Get user based on token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2- If token has not expired, and there is user, set the new password.
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3- Update changedPasswordAt property for the suer
  //     - handled in mongoose middleware
  // 4- Log the user in, send JWT.

  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   JWT_token: token,
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1- Get user from collection.
  const user = await User.findById(req.user.id).select('+password');
  // 2- Check if posted  current password is correct.

  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3- If so, update password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4- Log user in, send JWT.

  createSendToken(user, 200, res);

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user,
  //   },
  // });
});
