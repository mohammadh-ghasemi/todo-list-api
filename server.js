const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// console.log(app.get("env"));
// console.log(process.env.PASSWORD);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`app running on http://127.0.0.1:${port}`);
});
