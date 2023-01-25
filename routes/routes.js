require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
var parser = require("../rules/rules");

router.post("/login", async (req, res) => {
  let user = req.headers.user;
  let pass = req.headers.pass;
  if (3 > 7) {
    //(await User.findOne({ user: user, pass: pass }).exec()) == null) {
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

module.exports = router;
