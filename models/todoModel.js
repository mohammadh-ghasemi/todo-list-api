const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [30, 'A todo name must have less or equal then 40 characters'],
    minlength: [3, 'A todo name must have more or equal then 10 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority is either: low, medium, high',
    },
  },
  dueDate: Date,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Todo must belong to a user'],
  },
});

// todoSchema.pre(/^find/, function () {
//   this.populate({
//     path: 'user',
//     select: 'name email',
//   });
// });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
