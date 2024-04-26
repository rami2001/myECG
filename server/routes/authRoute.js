const express = require("express");
const router = express.Router();

const { auth } = require("../controllers/authController");

router.post("/", auth);

module.exports = router;
