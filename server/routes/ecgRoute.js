const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  upload,
  digitize,
  reported,
  getAll,
  getECG,
  importECG,
  bad,
  deleteECG,
} = require("../controllers/ecgController");
const { RESPONSE } = require("../util/response");

router.post("/", async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
        .json({ message: "Veuillez fournir une image JPEG ou PNG." });
    } else if (err) {
      return res
        .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
        .json({ message: "Erreur lors du téléchargement de l'image." });
    }
    digitize(req, res);
  });
});

router.post("/report", reported, (_, res, err) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(RESPONSE.CLIENT_ERROR.BAD_REQUEST)
      .json({ message: "Veuillez fournir une image JPEG ou PNG." });
  }

  res.status(RESPONSE.SUCCESSFUL.CREATED).json({
    message: "Mauvais ECG reporté avec succès ! Merci pour votre feedback.",
  });
});

router.get("/", getAll);
router.get("/:ecgId", getECG).delete("/:ecgId", deleteECG);

router.get("/import/:ecgId", importECG);

router.post("/bad", bad);

module.exports = router;
