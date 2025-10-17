const express = require("express");
const multer = require("multer");
const {
  upload,
  getProfileImage,
  deleteProfileImage,
} = require("../controllers/profileImageController");

const router = express.Router();

router.post("/image/:profileId", upload, (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: "Photo de profil ajoutée avec succès !" });
  });
});

router.get("/image/:profileId", getProfileImage);

router.delete("/image/:profileId", deleteProfileImage);

module.exports = router;
