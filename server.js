const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('-- DB connection successful! --');
  });
// console.log(app.get("env"));
// console.log(process.env.PASSWORD);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app running on http://127.0.0.1:${port}`);
});
