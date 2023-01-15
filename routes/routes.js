require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const token = jwt.sign(
    {
      name: "pepe",
    },
    process.env.PRIVATE_KEY
  );

  res.header("auth-token", token).json({
    data: { token },
  });
});

router.post("/logout", async (req, res) => {});

router.post("/regex", async (req, res) => {
  const auth_token = req.headers.authorization;
  if (!auth_token) {
    res.send(401, "Unauthorized request");
  }

  const accessToken = auth_token.split(" ")[1];
  jwt.verify(accessToken, process.env.PRIVATE_KEY, (err, payload) => {
    if (err) {
      res.send(401, "Unauthorized request");
    }
    res.send(200, {
      message:
        "We cannot perform this operation\n" +
        "You will be connected to an external server\n" +
        "Please keep waiting...",
    });
    // Enviamos regex a PHP
  });
});

module.exports = router;
