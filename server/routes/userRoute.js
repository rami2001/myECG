const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/userController");

router.patch("/", updateUser).delete("/", deleteUser).get("/", getUser);

module.exports = router;
