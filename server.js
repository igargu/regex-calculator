const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import routes
const routes = require("./routes/routes");
app.use("/", routes);

// Connect to DB
mongoose.connect(
  "mongodb://admin:admin@localhost:1888/admin?authMechanism=DEFAULT",
  () => {
    console.log("Connect to DB!");
  }
);

// Start listening to the server
app.listen(3000);
