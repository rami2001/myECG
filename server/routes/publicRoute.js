const express = require("express");
const router = express.Router();

const {
  getLink,
  validateToken,
  reset,
} = require("../controllers/resetController");

router.post("/reset", getLink);
router.get("/reset/password/:token", validateToken);
router.post("/reset/password", reset);

module.exports = router;
