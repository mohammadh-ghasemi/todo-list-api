const express = require("express");
const app = express();
const todoRouter = require("./routes/todoRoutes");

app.use(express.json());
app.use("/api/v1/todos", todoRouter);

module.exports = app;
