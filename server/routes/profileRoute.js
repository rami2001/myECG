const express = require("express");
const router = express.Router();

const {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfiles,
} = require("../controllers/profileController");

router
  .get("/", getProfiles)
  .post("/", createProfile)
  .put("/", updateProfile)
  .delete("/", deleteProfile);

module.exports = router;
