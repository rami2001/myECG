const express = require("express");
const router = express.Router();
const {
  getDatasetLink,
  getParticipatingECGs,
  getAllParticipatingECGs,
} = require("../controllers/datasetController");

router.post("/dataset", getDatasetLink);
router.get("/dataset/:token", getParticipatingECGs);
router.get("/dataset", getAllParticipatingECGs);

module.exports = router;
