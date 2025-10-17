const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { PrismaClient } = require("@prisma/client");

const { USER_IMAGE_DESTINATION } = require("../util/global");
const { RESPONSE } = require("../util/response");

const prisma = new PrismaClient();

const ProfilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, USER_IMAGE_DESTINATION);
  },
  filename: async (req, file, cb) => {
    try {
      const { profileId } = req.params;

      if (!profileId) {
        return cb(new Error("Champ manquant !"));
      }

      const profile = await prisma.profile.findUnique({
        where: {
          id: parseInt(profileId),
        },
        include: {
          user: true,
        },
      });

      if (!profile || profile.userId !== parseInt(req.id)) {
        return cb(new Error("Profile introuvable !"));
      }

      const fileName = `${profile.userId}_${profileId}${path.extname(
        file.originalname
      )}`;

      const oldFilePath = path.join(
        __dirname,
        "../" + USER_IMAGE_DESTINATION + profile.image
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          image: fileName,
        },
      });

      cb(null, fileName);
    } catch (error) {
      if (error.message !== "Unexpected end of form") {
        cb(new Error("Internal server error"));
      }
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "Veuillez fournir un ficher au format JPEG or PNG."
      )
    );
  }
};

const upload = multer({
  storage: ProfilePictureStorage,
  fileFilter: fileFilter,
}).single("image");

const getProfileImage = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await prisma.profile.findFirst({
      where: {
        id: parseInt(profileId),
      },
      select: {
        image: true,
        userId: true,
      },
    });

    if (!profile || profile.userId !== parseInt(req.id)) {
      return res
        .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
        .json({ message: "Profile introuvable !" });
    }

    const filePath = path.join(
      __dirname,
      "../" + USER_IMAGE_DESTINATION + profile.image
    );

    res.sendFile(filePath, null, (err) => {
      if (err) {
        res.status(RESPONSE.SUCCESSFUL.NO_CONTENT);
      } else {
        res.status(RESPONSE.SUCCESSFUL.OK);
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Impossible de récuperer la photo de profil." });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await prisma.profile.findUnique({
      where: {
        id: parseInt(profileId),
      },
    });

    if (!profile || profile.userId !== parseInt(req.id)) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Profile introuvable !" });
    }

    const filePath = path.join(
      __dirname,
      "../" + USER_IMAGE_DESTINATION + profile.image
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        image: null,
      },
    });

    res.sendStatus(RESPONSE.SUCCESSFUL.NO_CONTENT);
  } catch (error) {
    console.error(error);
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur lors de suppression de l'image." });
  }
};

module.exports = { upload, getProfileImage, deleteProfileImage };
