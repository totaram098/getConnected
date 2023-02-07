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
  resetPassword,
  createResetSession,
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/profile", tokenVerify, profile);
router.post("/resetPassword", resetPassword);
router.get("/createResetSession", createResetSession);
router.post("/generateOTP", localVariables, generateOTP);
router.post("/verifyOTP", verifyOTP);
router.get("/userLoggedIn", tokenVerify, userLoggedIn);
router.get("/logout", tokenVerify, logout);

module.exports = router;
