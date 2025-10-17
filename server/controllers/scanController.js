const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const pQueue = require("@esm2cjs/p-queue").default;

const { RESPONSE } = require("../util/response");
const { SCAN_DESTINATION, CONCURRENT_SCANS_LIMIT } = require("../util/global");

const scanStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = SCAN_DESTINATION(req.id);

    fs.access(dest, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(dest, { recursive: true }, (err) => {
          if (err) {
            return cb(new Error("Failed to create directory."));
          }
          cb(null, dest);
        });
      } else {
        cb(null, dest);
      }
    });
  },
  filename: async (req, file, cb) => {
    try {
      const fileName = "input.png";
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

const FILE_NAME_INPUT = "input.png";
const FILE_NAME_SCAN = "scan.png";
const PROCESS_NAME = "scan.py";

const processQueue = new pQueue({ concurrency: CONCURRENT_SCANS_LIMIT });

const scan = async (req, res) => {
  try {
    await processQueue.add(() => {
      return new Promise((resolve, reject) => {
        const pythonPath = path.join(__dirname, "..", PROCESS_NAME);
        const srcPath = path.join(
          __dirname,
          "..",
          "images",
          `temp_${req.id}`,
          FILE_NAME_INPUT
        );
        const dstPath = path.join(
          __dirname,
          "..",
          "images",
          `temp_${req.id}`,
          FILE_NAME_SCAN
        );

        const pythonProcess = spawn("python", [pythonPath, srcPath, dstPath]);

        pythonProcess.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            res.sendFile(dstPath, null, (notFound) => {
              if (notFound) {
                res.status(RESPONSE.SUCCESSFUL.NO_CONTENT);
              } else {
                res.status(RESPONSE.SUCCESSFUL.OK);
              }
            });
            resolve();
          } else {
            res
              .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
              .json({ message: "Impossible de scanner l'ECG !" });
            reject(new Error("Scan failed"));
          }
        });
      });
    });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

module.exports = { upload, scan };
