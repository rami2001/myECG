const express = require("express");
const router = express.Router();

const { updateUser, deleteUser } = require("../controllers/userController");

router.put("/", updateUser).delete("/", deleteUser);

module.exports = router;
