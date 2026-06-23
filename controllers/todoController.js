const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Todo = require('./../models/todoModel');
const APIFeatures = require('./../utils/apiFeatures');

// baseUrl: '/api/v1/users/67cc8ed8a96c6e1544781e7a/todos',
// originalUrl: '/api/v1/users/67cc8ed8a96c6e1544781e7a/todos',

exports.getAllTodos = catchAsync(async (req, res) => {
  let filter = {};
  if (req.originalUrl == '/api/v1/users/todos') filter = { user: req.user.id };
  // const todos = await Todo.find(filter);

  const features = new APIFeatures(Todo.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  res.status(200).json({
    status: 'success',
    results: doc.length,
    doc,
  });
});

exports.getTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return new AppError('No todo found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      todo,
    },
  });
});

exports.createTodo = catchAsync(async (req, res) => {
  if (!req.body.user) req.body.user = req.user.id;

  const newTodo = await Todo.create(req.body);
  res.status(200).json({
    status: 'success',
    newTodo,
  });
});

exports.deleteTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return new AppError('No todo found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    todo,
  });
});

exports.updateTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!todo) {
    return new AppError('No todo found with that ID', 404);
  }
  res.status(200).json({
    status: 'success',
    todo,
  });
});
