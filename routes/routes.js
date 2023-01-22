require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
var parser = require("../rules/rules");

router.post("/login", async (req, res) => {
  let user = req.headers.user;
  let pass = req.headers.pass;
  if ((await User.findOne({ user: user, pass: pass }).exec()) == null) {
    res.json({
      data: null,
    });
  } else {
    const token = jwt.sign(
      {
        user: user,
        pass: pass,
      },
      process.env.PRIVATE_KEY
    );
    res.header("auth-token", token).json({
      data: { token },
    });
  }
});

router.post("/regex", async (req, res) => {
  const auth_token = req.headers.authorization;
  if (!auth_token) {
    res.status(401).send("Unauthorized request");
  }
  const accessToken = auth_token.split(" ")[1];
  jwt.verify(accessToken, process.env.PRIVATE_KEY, (err, payload) => {
    if (err) {
      res.status(401).send("Unauthorized request");
    }
    res.status(200).send({
      message: parser.parse(`Evaluar[${req.headers.regex}];`),
    });
  });
});

module.exports = router;
