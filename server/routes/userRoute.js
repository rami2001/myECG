const express = require("express");
const router = express.Router();

const { createUser, deleteUser } = require("../controllers/userController");

router
    .post("/", createUser)
    .delete("/", deleteUser);

module.exports = router;
