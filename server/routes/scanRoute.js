const express = require("express");
const router = express.Router();
const multer = require("multer");

const { upload, scan } = require("../controllers/scanController");
const { RESPONSE } = require("../util/response");

router.post("/", upload, (_, res, err) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
      .json({ message: "Veuillez fournir une image JPEG ou PNG." });
  }

  res
    .status(RESPONSE.SUCCESSFUL.CREATED)
    .json({ message: "Photo reçue avec succès." });
});

router.get("/", scan);

module.exports = router;
