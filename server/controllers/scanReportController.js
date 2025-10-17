const { format } = require("date-fns");
const multer = require("multer");
const crypto = require("crypto");

const { SCAN_REPORT_DESITNATION } = require("../util/global");

const scanStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SCAN_REPORT_DESITNATION);
  },
  filename: async (req, file, cb) => {
    try {
      const randomString = crypto.randomBytes(8).toString("hex");
      const fileName = `${format(
        new Date(),
        "ddMMyyyy_hh_mm_ss"
      )}_${randomString}.png`;
      cb(null, fileName);
    } catch (error) {
      console.log(error);
    }
  },
});

const fileFilter = (_, file, cb) => {
  const allowedMimetypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("Veuillez fournir une image JPEG ou PNG."));
  }
};

const upload = multer({
  storage: scanStorage,
  fileFilter: fileFilter,
}).single("image");

module.exports = { upload };
