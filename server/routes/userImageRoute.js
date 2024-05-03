const express = require("express");
const router = express.Router();

const { setProfilePicture } = require("../controllers/userImageController");

router.post("/", setProfilePicture);

module.exports = router;
