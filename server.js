const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var WebSocketServer = require("ws").Server;
const jwt = require("jsonwebtoken");
var parser = require("./rules/rules");

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

class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  peek() {
    return this.items[this.frontIndex];
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
  }
}
const queue = new Queue();

var wss = new WebSocketServer({ port: 3030 });
wss.on("connection", function connection(ws) {
  ws.on("message", function broadcastMsg(msg) {
    const auth_token = JSON.parse(msg).token;
    if (!auth_token) {
      console.log("Unauthorized request");
    }
    jwt.verify(auth_token, process.env.PRIVATE_KEY, (err, payload) => {
      // Añadir regex a la cola
      queue.enqueue(JSON.parse(msg).content);
      // Esperar un tiempo aleatorio
      setTimeout(() => {
        // Coger la primera regex y enviarla
        let regex = queue.peek();
        ws.send(
          JSON.stringify({
            result: regex + " : " + parser.parse(`Evaluar[${regex}];`),
          })
        );
        // Eliminar regex de la cola
        queue.dequeue();
      }, Math.floor(Math.random() * 10000) + 1);
    });
  });
});
