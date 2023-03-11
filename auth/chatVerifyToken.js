const express = require("express");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const apiSecretKey = "userLoginJWTKey";

const app = express();
app.use(express.json());
app.use(cookieParser("secretKey"));

const verifyToken = (req, resp, next) => {
  const cookieValue = req.signedCookies.getConnected;
  if (cookieValue != undefined) {
    const token = cookieValue.token;
    if (jwt.verify(token, apiSecretKey)) {
      next();
    }
  } else {
    resp.redirect("/login");
  }
};
module.exports = verifyToken;
