const express = require("express");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const tokenVerify = (req, res, next) => {
  if (!req.cookies.jwt_token) {
    res.status(401).json({ message: "Not Authorized" });
  }

  const token = req.cookies.jwt_token.token;
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const coded = jwt.verify(token, process.env.JWT_SECRET);
    if (jwt.verify(token, process.env.JWT_SECRET)) {
      next();
    } else {
      res.status(401).json({ message: "Could not verify." });
    }
    console.log(req.cookies.jwt_token.token);
    next();
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

module.exports = {
  tokenVerify,
};
