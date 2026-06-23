const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('./../controllers/authController');
const {
  updateMe,
  deleteMe,
  getAllUsers,
} = require('../controllers/userController');

const todoRouter = require('./todoRoutes');

const router = express.Router();

router.use('/todos', todoRouter);

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);
router.route('/updateMyPassword').patch(protect, updatePassword);

router.route('/updateMe').patch(protect, updateMe);
router.route('/deleteMe').delete(protect, deleteMe);

router.route('/').get(protect, getAllUsers);

module.exports = router;
