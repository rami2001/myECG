const express = require("express");
const router = express.Router();

const {
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

router
  .post("/", createProfile)
  .put("/", updateProfile)
  .delete("/", deleteProfile);

module.exports = router;
