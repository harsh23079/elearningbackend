const mongoose = require("mongoose");
require("dotenv").config();

const database = () =>
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("database is connected..."))
    .catch((err) =>
      console.log("Database is not connected and giving error: " + err.message)
    );

module.exports = database;
