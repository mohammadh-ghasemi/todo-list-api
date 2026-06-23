const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

const app = require('./app');

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log('DB Connected!'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`app run on http://127.0.0.1:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
