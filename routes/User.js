const express = require("express");
const { tokenVerify } = require("../auth");
const router = express.Router();

// user controllers
const { get, register, login } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/get", tokenVerify, get);
router.get("/",tokenVerify, get);

module.exports = router;
