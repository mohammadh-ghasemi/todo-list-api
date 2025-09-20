const express = require("express");
const todoRouter = require("./routes/todoRoutes");
const app = express();

app.use(express.json());

app.use("/api/v1/todos", todoRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`app running on http://127.0.0.1:${port}`);
});
