const app = require("./app");

const port = 3000;

app.listen(port, () => {
    console.log(`app running on http://127.0.0.1:${port}`);
});
