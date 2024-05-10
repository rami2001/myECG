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
        select: {
          image: true,
        },
      });

      const filePath = path.join(
        __dirname,
        "../" + USER_IMAGE_DESTINATION + user.image
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const fileName = req.id + path.extname(file.originalname);

      await prisma.user.update({
        where: {
          id: req.id,
        },
        data: {
          image: fileName,
        },
      });

      cb(null, fileName);
    } catch (error) {
      console.log(error);
    }
  },
});

const fileFilter = (req, file, cb) => {
  // Permettre seulement les fichiers image
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
      select: {
        image: true,
      },
      where: {
        id: req.id,
      },
    });

    if (!user) {
      return res
        .status(RESPONSE.CLIENT_ERROR.UNAUTHORIZED)
        .json({ message: "Utilisateur introuvable !" });
    }

    const filePath = path.join(
      __dirname,
      "../" + USER_IMAGE_DESTINATION + user.image
    );

    res.sendFile(filePath, null, (notFound) => {
      if (notFound) {
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
      select: {
        image: true,
      },
      where: {
        id: req.id,
      },
    });

    if (!user) {
      return res
        .status(RESPONSE.CLIENT_ERROR.NOT_FOUND)
        .json({ message: "Utilisateur introuvable !" });
    }

    const filePath = path.join(
      __dirname,
      "../" + USER_IMAGE_DESTINATION + user.image
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.user.update({
      where: {
        id: req.id,
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
