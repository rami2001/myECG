const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/adminController");

router.get("/", getUsers);

module.exports = router;
