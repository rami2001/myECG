const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  updatePassword,
  getSats,
} = require("../controllers/userController");

router.patch("/", updateUser).delete("/", deleteUser).get("/", getUser);
router.patch("/password", updatePassword);
router.get("/stats", getSats);

module.exports = router;
