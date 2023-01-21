require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
var parser = require("../rules");

router.post("/login", async (req, res) => {
  const token = jwt.sign(
    {
      name: req.body.user,
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
    let expression = "(4*3)/2";
    res.status(200).send({
      message: parser.parse(`Evaluar[${expression}];`),
    });
  });
});

module.exports = router;
