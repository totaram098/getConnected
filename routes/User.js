const express = require("express");
const { tokenVerify, localVariables } = require("../auth");
const router = express.Router();

// user controllers
const {
  userLoggedIn,
  register,
  login,
  logout,
  profile,
  generateOTP,
  verifyOTP,
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/profile", tokenVerify, profile);
router.get("/generateOTP", tokenVerify, localVariables, generateOTP);
router.get("/verifyOTP", tokenVerify, verifyOTP);
router.get("/userLoggedIn", tokenVerify, userLoggedIn);
router.get("/logout", tokenVerify, logout);

module.exports = router;
