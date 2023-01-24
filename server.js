const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var WebSocketServer = require("ws").Server;

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

var wss = new WebSocketServer({ port: 3000 });
wss.on("connection", function connection(ws) {
  ws.on("message", function broadcastMsg(msg) {
    const auth_token = JSON.parse(msg).token;
    if (!auth_token) {
      console.log("Unauthorized request");
    }
    const accessToken = auth_token.split(" ")[1];
    jwt.verify(accessToken, process.env.PRIVATE_KEY, (err, payload) => {
      if (err) {
        console.log("Unauthorized request");
      }
      ws.send(
        JSON.stringify({
          result: parser.parse(`Evaluar[${JSON.parse(msg).content}];`),
        })
      );
    });
  });
});
