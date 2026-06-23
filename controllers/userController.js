const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1- Create error if user POSTs password data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates'));
  }

  // 2- Update user document.
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res) => {
  // 1- Deactivate user ==> active = false
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // 2- Hide not active users from the query with query middleware.
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().populate({
    path: 'todos',
  });
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
