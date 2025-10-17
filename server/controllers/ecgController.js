const fs = require("fs");
const path = require("path");
const multer = require("multer");
const archiver = require("archiver");
const { spawn } = require("child_process");
const { format } = require("date-fns");
const pQueue = require("@esm2cjs/p-queue").default;

const { PrismaClient } = require("@prisma/client");

const {
  ECG_IMAGE_DESTINATION,
  ECG_REPORT_DESTINATION,
  CONCURRENT_DIGITIZING_LIMIT,
} = require("../util/global");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ECG_REPORT_DESTINATION);
  },
  filename: async (req, file, cb) => {
    try {
      const fileName = `${format(new Date(), "ddMMyyyy_hh_mm_ss")}.png`;
      cb(null, fileName);
    } catch (error) {
      console.log(error);
    }
  },
});

const ecgStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.id;
      const { profileId, note, date } = req.body;

      const ecg = await prisma.ecg.create({
        data: {
          profileId: parseInt(profileId),
          note: note,
          date: new Date(date),
        },
      });

      req.ecgId = ecg.id;
      req.date = date;

      const folderPath = path.join(
        __dirname,
        "..",
        ECG_IMAGE_DESTINATION,
        String(userId),
        String(profileId),
        String(ecg.id)
      );

      fs.access(folderPath, (error) => {
        if (!error) {
          cb(null, folderPath);
        } else {
          fs.mkdir(folderPath, { recursive: true }, (mkdirError) => {
            if (mkdirError) {
              console.log(mkdirError);
              cb(mkdirError, null);
            } else {
              cb(null, folderPath);
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
      cb(error, null);
    }
  },
  filename: async (req, file, cb) => {
    try {
      const fileName = "scan.png";

      await prisma.ecg.update({
        where: { id: req.ecgId },
        data: {
          image: `${ECG_IMAGE_DESTINATION}${String(req.id)}/${String(
            req.body.profileId
          )}/${String(req.ecgId)}`,
        },
      });

      cb(null, fileName);
    } catch (error) {
      console.log(error);
      cb(error, null);
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
  storage: ecgStorage,
  fileFilter: fileFilter,
}).single("image");

const reported = multer({
  storage: reportStorage,
  fileFilter: fileFilter,
}).single("image");

const FILE_NAME_INPUT = "scan.png";
const PROCESS_NAME = "main.py";

const processQueue = new pQueue({ concurrency: CONCURRENT_DIGITIZING_LIMIT });

const digitize = async (req, res) => {
  try {
    await processQueue.add(() => {
      return new Promise((resolve, reject) => {
        const userId = req.id;
        const { profileId, gender, dateOfBirth } = req.body;

        const age =
          (new Date(req.body.date) - new Date(dateOfBirth)) /
          (1000 * 60 * 60 * 24 * 365);

        const ecgId = req.ecgId;

        const pythonPath = path.join(__dirname, "..", PROCESS_NAME);

        const srcPath = path.join(
          __dirname,
          "..",
          ECG_IMAGE_DESTINATION,
          String(userId),
          String(profileId),
          String(ecgId),
          FILE_NAME_INPUT
        );

        const dstPath = path.join(
          __dirname,
          "..",
          ECG_IMAGE_DESTINATION,
          String(userId),
          String(profileId),
          String(ecgId)
        );

        const pythonProcess = spawn("python", [
          pythonPath,
          srcPath,
          dstPath,
          gender,
          age,
        ]);

        pythonProcess.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            const ecg = prisma.ecg.findFirst({ where: { id: ecgId } });
            res.status(RESPONSE.SUCCESSFUL.OK).json({ ecgId });
            resolve();
          } else {
            prisma.ecg
              .deleteMany({ where: { id: ecgId } })
              .catch(console.error);

            res
              .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
              .json({ message: "Impossible de numériser l'ECG !" });
            reject();
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
const getAll = async (req, res) => {
  const userId = req.id;

  try {
    const userWithEcgs = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: {
          include: {
            ecgs: {
              orderBy: {
                date: "desc",
              },
              select: {
                id: true,
                date: true,
                isBad: true,
                note: true,
                profileId: true,
              },
            },
          },
        },
      },
    });

    if (!userWithEcgs) {
      return res
        .status(404)
        .json({ message: "User not found or no ECG records available" });
    }

    const allEcgs = userWithEcgs.profiles.flatMap((profile) => profile.ecgs);

    return res.status(200).json([...allEcgs]);
  } catch (error) {
    console.error("Error fetching ECGs for user:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving the ECGs" });
  }
};

const getECG = async (req, res) => {
  const ecgId = req.params.ecgId;

  try {
    const ecg = await prisma.ecg.findFirst({
      where: { id: parseInt(ecgId) },
      select: {
        id: true,
        date: true,
        isBad: true,
        note: true,
        profileId: true,
        image: true,
        profile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!ecg) {
      return res.status(404).json({ message: "ECG introuvable." });
    }

    const userId = ecg.profile.userId;

    if (userId !== req.id) {
      return res
        .status(RESPONSE.CLIENT_ERROR.FORBIDDEN)
        .json({ message: "Vous n'avez pas accès à cette ressource." });
    }

    fs.readFile(`${ecg.image}/ecg.json`, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading ECG file:", err);
        return res
          .status(500)
          .json({ message: "Impossible de lire le fichier ECG." });
      }

      const ecgData = JSON.parse(data);

      return res.status(200).json({ ecg, ecgData });
    });
  } catch (error) {
    console.error("Error fetching the ECG:", error);
    return res.status(500).json({ message: "Impossible de récupérer l'ECG." });
  }
};

const bad = async (req, res) => {
  const { ecgId } = req.body;

  try {
    const ecg = await prisma.ecg.findFirst({
      where: { id: parseInt(ecgId) },
      select: { isBad: true },
    });

    if (!ecg) {
      return res.status(404).json({ message: "ECG introuvable." });
    }

    const updatedEcg = await prisma.ecg.update({
      where: { id: parseInt(ecgId) },
      data: { isBad: !ecg.isBad },
      select: { id: true, isBad: true },
    });

    return res.status(200).json({ message: `ECG mis à jour.`, updatedEcg });
  } catch (error) {
    console.error("Error updating ECG:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'ECG." });
  }
};

const deleteECG = async (req, res) => {
  const ecgId = req.params.ecgId;

  try {
    const ecg = await prisma.ecg.findFirst({
      where: { id: parseInt(ecgId) },
      select: {
        id: true,
        image: true,
        profile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!ecg) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "ECG introuvable." });
    }

    if (ecg.profile.userId !== req.id) {
      return res
        .status(RESPONSE.CLIENT_ERROR.FORBIDDEN)
        .json({ message: "Vous n'avez pas accès à cette ressource." });
    }

    await prisma.ecg.delete({
      where: { id: parseInt(ecgId) },
    });

    const ecgFolder = path.join(ecg.image);

    fs.rm(ecgFolder, { recursive: true, force: true }, async (err) => {
      if (err) {
        console.error("Erreur lors de la suppression des fichiers ECG :", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression des fichiers ECG." });
      }

      return res
        .status(200)
        .json({ message: `ECG #${ecgId} supprimé avec succès.` });
    });
  } catch (error) {
    console.error("Error deleting ECG:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'ECG." });
  }
};

const importECG = async (req, res) => {
  const ecgId = req.params.ecgId;

  try {
    const ecg = await prisma.ecg.findFirst({
      where: { id: parseInt(ecgId) },
      include: {
        profile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!ecg) {
      return res.status(404).json({ message: "ECG introuvable." });
    }

    const userId = ecg.profile.userId;
    const profileId = ecg.profileId;

    const zipFileName = `ecg_${ecgId}.zip`;
    const zipPath = path.join(__dirname, "..", zipFileName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      res.download(zipPath, (err) => {
        if (err) {
          console.error("Erreur d'envoi de l'ECG :", err);
          res.status(500).json({ message: "Impossible de télécharger l'ECG." });
        } else {
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "Impossible de supprimer l'archive ECG :",
                unlinkErr
              );
            }
          });
        }
      });
    });

    archive.on("error", (err) => {
      console.error("Erreur lors de l'archivage :", err);
      res.status(500).json({ message: "Erreur lors de l'import de l'ECG." });
    });

    archive.pipe(output);

    const ecgFolder = path.join(
      ECG_IMAGE_DESTINATION,
      String(userId),
      String(profileId),
      String(ecgId)
    );

    const scanFilePath = path.join(ecgFolder, "scan.png");
    const jsonFilePath = path.join(ecgFolder, "ecg.json");

    if (fs.existsSync(scanFilePath) && fs.existsSync(jsonFilePath)) {
      archive.file(scanFilePath, { name: `ecg_${ecgId}.png` });
      archive.file(jsonFilePath, { name: `ecg_${ecgId}.json` });
    } else {
      console.warn(`Les fichiers pour l'ECG #${ecgId} sont manquants.`);
    }

    await archive.finalize();
  } catch (error) {
    console.error("Erreur lors de l'import de l'ECG :", error);
    res.status(500).json({ message: "Erreur lors de l'import de l'ECG." });
  }
};

module.exports = {
  upload,
  digitize,
  reported,
  getAll,
  getECG,
  deleteECG,
  importECG,
  bad,
};
