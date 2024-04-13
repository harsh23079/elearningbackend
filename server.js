const express = require("express");
const db = require("./config/database");
const app = express();
require("dotenv").config();
db();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server is listening on port:${PORT}`));
