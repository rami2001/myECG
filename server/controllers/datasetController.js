const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const nodemailer = require("nodemailer");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

require("dotenv").config();

const { RESPONSE } = require("../util/response");
const { ECG_IMAGE_DESTINATION } = require("../util/global");

const getDatasetLink = async (req, res) => {
  const { email } = req.body;

  const allowedEmails = JSON.parse(process.env.ALLOWED_ENTITIES);

  if (!allowedEmails.includes(email)) {
    return res.status(RESPONSE.CLIENT_ERROR.FORBIDDEN).json({
      message: "Vous n'êtes pas autorisé à accéder à ce dataset.",
    });
  }

  const datasetToken = jwt.sign({ email }, process.env.DATASET_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const datasetUrl = `${process.env.CLIENT}/home/api/${datasetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADRESS,
    to: email,
    subject: "myECG - Accès au dataset",
    html: `<p>Rendez-vous sur ce <a href="${datasetUrl}">lien</a> pour télécharger le Dataset actuel. Ce lien n'est valable que pour une heure.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(datasetUrl);

    res.status(RESPONSE.SUCCESSFUL.OK).json({
      message:
        "Le lien de téléchargement du Dataset a été envoyé à votre e-mail.",
    });
  } catch (error) {
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Impossible d'envoyer l'e-mail." });
  }
};

const getParticipatingECGs = async (req, res) => {
  const { token } = req.params;

  try {
    // const decoded = jwt.verify(token, process.env.DATASET_TOKEN_SECRET);
    // const email = decoded.email;

    // const allowedEmails = JSON.parse(process.env.ALLOWED_ENTITIES);

    // if (!allowedEmails.includes(email)) {
    //   return res.status(RESPONSE.CLIENT_ERROR.FORBIDDEN).json({
    //     message: "Vous n'êtes pas autorisé à accéder à ce dataset.",
    //   });
    // }

    const participatingUsers = await prisma.user.findMany({
      where: { isParticipating: true },
      include: {
        profiles: {
          include: {
            ecgs: true,
          },
        },
      },
    });

    if (participatingUsers.length === 0) {
      return res.status(404).json({
        message: "Aucun utilisateur trouvé participant au programme.",
      });
    }

    const zipFileName = "ecgs.zip";
    const zipPath = path.join(__dirname, "..", zipFileName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      return res
        .status(500)
        .json({ message: "Impossible de créer l'archive." });
    });

    output.on("close", () => {
      res.download(zipPath, (err) => {
        if (err) {
          console.error("Erreur d'envoi de l'archive :", err);
          return res
            .status(500)
            .json({ message: "Impossible de télécharger l'archive." });
        }

        fs.unlink(zipPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Impossible de supprimer l'archive :", unlinkErr);
          }
        });
      });
    });

    archive.pipe(output);

    for (const user of participatingUsers) {
      for (const profile of user.profiles) {
        for (const ecg of profile.ecgs) {
          const ecgId = ecg.id;
          const ecgFolder = path.join(
            ECG_IMAGE_DESTINATION,
            String(user.id),
            String(profile.id),
            String(ecgId)
          );

          const scanFilePath = path.join(ecgFolder, "scan.png");
          const jsonFilePath = path.join(ecgFolder, "ecg.json");

          if (fs.existsSync(scanFilePath) && fs.existsSync(jsonFilePath)) {
            archive.file(scanFilePath, { name: `${ecgId}.png` });
            archive.file(jsonFilePath, { name: `${ecgId}.json` });
          } else {
            console.warn(
              `Il manque un fichier pour #${ecgId}, passage au suivant.`
            );
          }
        }
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Erreur lors de la création de l'archive des ECGs", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la génération du fichier." });
  }
};

const getAllParticipatingECGs = async (req, res) => {
  try {
    // Find all users who are participating
    const users = await prisma.user.findMany({
      where: {
        isParticipating: true,
      },
    });

    // Create an empty array to store the ECGS
    const ecgs = [];

    // Loop through each user and find their ECGS
    for (const user of users) {
      const userEcgs = await prisma.ecg.findMany({
        where: {
          id: user.id,
        },
      });

      // Add the ECGS to the array
      ecgs.push(...userEcgs);
    }

    // Create a new archive file
    const archive = archiver("zip");

    // Attach the archive file to the response
    res.attachment("ecgs.zip");

    // Pipe the archive file to the response
    archive.pipe(res);

    // Loop through each ECG and add it to the archive file
    for (const ecg of ecgs) {
      const scanFilePath = path.join(ecg.image, "scan.png");
      const jsonFilePath = path.join(ecg.image, "ecg.json");

      // Add the scan file to the archive
      archive.file(scanFilePath, { name: `ecg_${ecg.id}.png` });

      // Add the JSON file to the archive
      archive.file(jsonFilePath, { name: `ecg_${ecg.id}.json` });
    }

    // Finalize the archive file
    archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error exporting ECGS");
  }
};

module.exports = {
  getDatasetLink,
  getParticipatingECGs,
  getAllParticipatingECGs,
};
