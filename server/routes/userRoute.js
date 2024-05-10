const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  updatePassword,
} = require("../controllers/userController");

router.patch("/", updateUser).delete("/", deleteUser).get("/", getUser);
router.patch("/password", updatePassword);

module.exports = router;
