const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import routes
const routes = require("./routes/routes");
app.use("/", routes);

// Start listening to the server
app.listen(3000);
