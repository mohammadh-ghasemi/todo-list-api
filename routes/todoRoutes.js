const express = require("express");

const {
    getAllTodos,
    getTodo,
    deleteTodo,
    updateTodo,
    createTodo,
} = require("./../controllers/todoControllers");

const router = express.Router();

router.route("/").get(getAllTodos).post(createTodo);
router.route("/:id").get(getTodo).patch(updateTodo).delete(deleteTodo);

module.exports = router;
