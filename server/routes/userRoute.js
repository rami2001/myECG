const express = require("express");
const router = express.Router();

const { deleteUser, updateUser } = require("../controllers/userController");

router
    .delete("/", deleteUser)
    .put("/", updateUser);

module.exports = router;
