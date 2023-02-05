const express = require("express");
const { tokenVerify } = require("../auth");
const router = express.Router();

// user controllers
const {
  userLoggedIn,
  register,
  login,
  logout,
  profile,
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.post("/profile",tokenVerify, profile)
router.get("/userLoggedIn", tokenVerify, userLoggedIn);
router.get("/logout", tokenVerify, logout);


module.exports = router;
