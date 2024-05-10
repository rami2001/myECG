const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { PrismaClient } = require("@prisma/client");

const { ECG_IMAGE_DESTINATION } = require("../util/global");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const ecgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ECG_IMAGE_DESTINATION);
  },
  filename: async (req, file, cb) => {
    try {
      const { profileId, note, date } = req.body;

      const ecg = await prisma.ecg.create({
        data: {
          profileId: parseInt(profileId),
          note: note,
          date: new Date(date),
        },
      });

      const fileName =
        profileId + "-" + ecg.id + path.extname(file.originalname);

      await prisma.ecg.update({
        where: { id: ecg.id },
        data: { image: fileName },
      });

      cb(null, fileName);
    } catch (error) {
      console.log(error);
    }
  },
});

const fileFilter = (_, file, cb) => {
  // Permettre seulement les fichiers image
  const allowedMimetypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("Veuillez fournir une image JPEG ou PNG."));
  }
};

const upload = multer({
  storage: ecgStorage,
  fileFilter: fileFilter,
}).single("image");

module.exports = { upload };
