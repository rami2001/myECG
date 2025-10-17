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
      const user = await prisma.user.findUnique({
        where: {
          id: req.id,
        },
        include: {
          profiles: {
            take: 1,
            select: {
              id: true,
              image: true,
            },
          },
        },
      });

      if (!user || !user.profiles.length) {
        return cb(new Error("User or profile not found"));
      }

      const profile = user.profiles[0];
      const fileName = `${req.id}_${profile.id}${path.extname(
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
      console.log(error);
      cb(new Error("Internal server error"));
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("Veuillez fournir une image JPEG ou PNG."));
  }
};

const upload = multer({
  storage: ProfilePictureStorage,
  fileFilter: fileFilter,
}).single("image");

const getImage = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.id },
      include: {
        profiles: {
          take: 1,
          select: {
            image: true,
          },
        },
      },
    });

    if (!user || !user.profiles.length) {
      return res
        .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
        .json({ message: "Utilisateur ou profil introuvable !" });
    }

    const profile = user.profiles[0];
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
    res
      .status(RESPONSE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ message: error });
  }
};

const deleteImage = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.id },
      include: {
        profiles: {
          take: 1,
          select: {
            id: true,
            image: true,
          },
        },
      },
    });

    if (!user || !user.profiles.length) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Utilisateur ou profil introuvable !" });
    }

    const profile = user.profiles[0];
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
      .json({ message: "Erreur interne du serveur." });
  }
};

module.exports = { upload, getImage, deleteImage };
