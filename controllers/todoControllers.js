exports.getAllTodos = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            data: "getall",
        },
    });
};
exports.getTodo = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            data: "get",
        },
    });
};
exports.createTodo = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            data: "created",
        },
    });
};
exports.updateTodo = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            data: "update",
        },
    });
};
exports.deleteTodo = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            data: "delete",
        },
    });
};
