const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenVerify = async (req, res, next) => {
  if (!req.cookies.jwt_token) {
    res.status(401).json({ message: "Not Authorized" });
    return;
  }

  const token = req.cookies.jwt_token;

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        res.status(403).json({ msg: "Token verification failed!" });
        return;
      }
      if (result) {
        req.user_email = result.email;
        next();
      }
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

module.exports = {
  tokenVerify,
};
