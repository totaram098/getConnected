const express = require("express");
const router = express.Router();

// user controllers
const { get, register, login } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/get", get);
router.get("/", get);

module.exports = router;
