const express = require('express');
const {
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getTodo,
} = require('./../controllers/todoController');
const { protect, isOwner } = require('../controllers/authController');
const Todo = require('../models/todoModel');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, isOwner(Todo), getAllTodos)
  .post(protect, isOwner(Todo), createTodo);
router
  .route('/:id')
  .get(protect, isOwner(Todo), getTodo)
  .delete(protect, isOwner(Todo), deleteTodo)
  .patch(protect, isOwner(Todo), updateTodo);

module.exports = router;
