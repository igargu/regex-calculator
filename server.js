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

var WebSocketServer = require("ws").Server;

var wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function connection(ws) {
  ws.on("message", function broadcastMsg(msg) {
    ws.sendMsgThroughWebSocket(JSON.stringify(JSON.parse(msg).content));
  });
});
