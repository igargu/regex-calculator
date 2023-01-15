const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import routes
const routes = require("./routes/routes");
app.use("/", routes);

// Start listening to the server
app.listen(3000);

function query(method, token = 0) {
  const url = `http://localhost:3000/${method}`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
}
