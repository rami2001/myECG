const express = require("express");
const router = express.Router();

const {
  register,
  checkIfIsExistingUser,
} = require("../controllers/registerController");

router.post("/", register);
router.post("/check", checkIfIsExistingUser);

module.exports = router;
